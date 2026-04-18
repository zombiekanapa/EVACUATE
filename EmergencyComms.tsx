
import React, { useState, useEffect } from 'react';
import { EmergencyContact, EMERGENCY_TEMPLATES as DEFAULT_TEMPLATES, EvacuatorLanguage } from '../types';

const CONTACTS_STORAGE_KEY = 'evacuate_contacts_v2';
const TEMPLATES_STORAGE_KEY = 'evacuate_custom_templates_v2';

const EmergencyComms: React.FC<{ lang: EvacuatorLanguage; isAdmin: boolean }> = ({ lang, isAdmin }) => {
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [templates, setTemplates] = useState<{id: string, label: string, text: string}[]>([]);
    const [showContactForm, setShowContactForm] = useState(false);
    const [editingContact, setEditingContact] = useState<string | null>(null);
    const [newContact, setNewContact] = useState<Partial<EmergencyContact>>({ role: 'FAMILY' });
    const [selectedTemplate, setSelectedTemplate] = useState<string>('safe');
    const [showHelp, setShowHelp] = useState(false);

    const loadContacts = () => {
        const savedContacts = localStorage.getItem(CONTACTS_STORAGE_KEY);
        if (savedContacts) try { setContacts(JSON.parse(savedContacts)); } catch (e) {}
        const savedTemplates = localStorage.getItem(TEMPLATES_STORAGE_KEY);
        if (savedTemplates) try { setTemplates(JSON.parse(savedTemplates)); } catch (e) { setTemplates(DEFAULT_TEMPLATES); }
        else setTemplates(DEFAULT_TEMPLATES);
    };

    useEffect(() => { loadContacts(); }, []);

    const saveContact = () => {
        if (!newContact.name || !newContact.phone) return;
        let updated;
        if (editingContact) {
            updated = contacts.map(c => c.id === editingContact ? { ...c, ...newContact as EmergencyContact } : c);
        } else {
            const contact: EmergencyContact = {
                id: Date.now().toString(),
                name: newContact.name, role: newContact.role as any,
                phone: newContact.phone, email: newContact.email, notes: newContact.notes
            };
            updated = [...contacts, contact];
        }
        setContacts(updated);
        localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(updated));
        setShowContactForm(false);
        setEditingContact(null);
        setNewContact({ role: 'FAMILY' });
    };

    const deleteContact = (id: string) => {
        const updated = contacts.filter(c => c.id !== id);
        setContacts(updated);
        localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(updated));
    };

    const sendMessage = (contact: EmergencyContact, method: 'SMS' | 'WHATSAPP') => {
        const template = templates.find(t => t.id === selectedTemplate);
        const text = template ? template.text : "EMERGENCY ALERT";
        const cleanPhone = contact.phone.replace(/[^\d+]/g, '');
        if (method === 'SMS') window.location.href = `sms:${cleanPhone}?&body=${encodeURIComponent(text)}`;
        else if (method === 'WHATSAPP') window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
    };

    const isPl = lang === EvacuatorLanguage.PL;

    const helpText = isPl 
        ? "📞 KONTAKTY ALARMOWE: Zarządzaj swoją listą zaufanych osób. Możesz szybko wysyłać gotowe szablony wiadomości (np. 'Jestem bezpieczny') przez SMS lub WhatsApp."
        : "📞 EMERGENCY CONTACTS: Manage your trusted contacts list. You can quickly send ready-made message templates (e.g., 'I am safe') via SMS or WhatsApp.";

    return (
        <div className="h-full flex flex-col bg-transparent text-white overflow-hidden font-sans backdrop-blur-sm relative">
            
            {showHelp && (
                <div className="absolute inset-0 z-[50] bg-black/95 p-8 flex flex-col items-center justify-center text-center animate-fadeIn">
                    <span className="text-4xl mb-4">❔</span>
                    <p className="text-sm font-black text-white uppercase italic leading-relaxed mb-6">{helpText}</p>
                    <button onClick={() => setShowHelp(false)} className="bg-red-700 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase">OK</button>
                </div>
            )}

            <div className="p-2 border-b border-white/5 bg-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h2 className="font-black text-[8px] text-blue-900 flex items-center gap-1 uppercase italic tracking-tighter opacity-60"><span>📡</span> KONTAKTY_LISTA</h2>
                    <button onClick={() => setShowHelp(true)} className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center text-zinc-600 hover:text-white transition-all text-[10px]">❔</button>
                </div>
                <button onClick={() => setShowContactForm(!showContactForm)} className="bg-blue-900/10 hover:bg-blue-900/20 text-blue-700 px-2 py-0.5 rounded-full text-[6px] font-black uppercase border border-blue-900/10 transition-all">
                    {showContactForm ? (isPl ? 'ZAMKNIJ' : 'CLOSE') : (isPl ? '+ DODAJ' : '+ ADD')}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-4 custom-scrollbar">
                {showContactForm && (
                    <div className="bg-black/20 border border-white/5 p-2 rounded-xl animate-fadeIn space-y-1 shadow-2xl">
                        <input className="w-full bg-white/5 border border-white/5 p-1.5 rounded-lg text-[7px] text-white outline-none" placeholder={isPl ? 'NAZWA...' : "NAME..."} value={newContact.name || ''} onChange={e => setNewContact({...newContact, name: e.target.value})} />
                        <input className="w-full bg-white/5 border border-white/5 p-1.5 rounded-lg text-[7px] text-white outline-none" placeholder={isPl ? 'TELEFON...' : "PHONE..."} value={newContact.phone || ''} onChange={e => setNewContact({...newContact, phone: e.target.value})} />
                        <select className="w-full bg-black/40 border border-white/5 p-1.5 rounded-lg text-[7px] text-white outline-none" value={newContact.role} onChange={e => setNewContact({...newContact, role: e.target.value as any})}>
                            <option value="FAMILY">{isPl ? 'RODZINA' : 'FAMILY'}</option>
                            <option value="MEDIC">{isPl ? 'MEDYK' : 'MEDIC'}</option>
                            <option value="COMMUNITY">{isPl ? 'SPOŁECZNOŚĆ' : 'COMMUNITY'}</option>
                            <option value="OTHER">{isPl ? 'INNE' : 'OTHER'}</option>
                        </select>
                        <button onClick={saveContact} className="w-full bg-blue-900/40 text-white/80 py-1.5 rounded-lg font-black text-[6px] uppercase shadow-lg active:scale-95 transition-all mt-1">
                           {editingContact ? (isPl ? 'ZAKTUALIZUJ' : 'UPDATE') : (isPl ? 'ZAPISZ_WĘZEŁ' : 'SAVE_NODE')}
                        </button>
                    </div>
                )}

                <section className="space-y-2">
                    <h3 className="text-[5px] font-black text-zinc-800 uppercase tracking-widest italic flex items-center gap-1 opacity-40">
                      <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
                      {isPl ? 'TWOJA_LISTA_SURVIVAL' : 'YOUR_SURVIVAL_LIST'}
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-1">
                        {contacts.length === 0 && (
                            <div className="py-6 text-center text-[6px] text-zinc-900 font-black uppercase tracking-widest opacity-20 italic">LISTA_PUSTA</div>
                        )}
                        {contacts.map(c => (
                            <div key={c.id} className="bg-white/5 border border-white/5 p-2 rounded-xl flex items-center justify-between group hover:bg-white/5 transition-all">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-blue-900/5 border border-blue-900/5 flex items-center justify-center text-[7px] font-black opacity-60">
                                        {c.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <h4 className="font-black text-white/60 uppercase text-[7px] leading-tight">{c.name}</h4>
                                      <span className="text-[5px] text-zinc-800 font-black uppercase tracking-widest leading-none">{c.role} • {c.phone}</span>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => sendMessage(c, 'SMS')} className="p-1 px-2 rounded-full bg-green-900/5 text-green-900 text-[5px] border border-green-900/5 hover:bg-green-900/10">SMS</button>
                                    <button onClick={() => sendMessage(c, 'WHATSAPP')} className="p-1 px-2 rounded-full bg-black/20 border border-white/5 text-zinc-800 text-[5px] hover:text-white">WA</button>
                                    <button onClick={() => deleteContact(c.id)} className="p-1 text-zinc-900 hover:text-red-900 text-[5px]">✕</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-white/5 p-2 rounded-xl border border-white/5 space-y-2">
                    <h3 className="text-[5px] font-black text-zinc-800 uppercase tracking-widest italic opacity-40">{isPl ? 'SZABLONY_INFO' : 'INFO_TEMPLATES'}</h3>
                    <div className="flex flex-wrap gap-1">
                        {templates.map(t => (
                            <button key={t.id} onClick={() => setSelectedTemplate(t.id)} className={`px-2 py-0.5 rounded-full text-[5px] font-black border transition-all uppercase ${selectedTemplate === t.id ? 'bg-blue-900/30 border-blue-900/10 text-white/80' : 'bg-black/10 text-zinc-800 border-white/5'}`}>
                                {t.label}
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default EmergencyComms;
