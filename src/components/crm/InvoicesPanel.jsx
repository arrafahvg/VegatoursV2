import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Download, Trash2, Receipt, X, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { generateInvoicePDF } from '@/lib/pdfUtils';
import { whatsappSendTo } from '@/lib/constants';

const STATUS_COLORS = {
  unpaid: 'bg-orange-100 text-orange-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

const CURRENCIES = ['IDR', 'USD', 'AUD', 'EUR', 'SGD', 'GBP'];
const LABELS = ['Down Payment', 'Second Payment', 'Final Payment', 'Additional Charges', 'Refund', 'Other'];
const METHODS = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'qris', label: 'QRIS' },
  { value: 'cash', label: 'Cash' },
  { value: 'other', label: 'Other' },
];

const BLANK = {
  label: 'Down Payment',
  line_items: [{ description: '', amount: '' }],
  tax_percentage: '',
  currency: 'IDR',
  due_date: '',
  status: 'unpaid',
  payment_method: 'bank_transfer',
  notes: '',
};

function calcSubtotal(items) {
  return items.reduce((sum, it) => sum + (parseFloat(it.amount) || 0), 0);
}

function calcTax(subtotal, taxPct) {
  if (!taxPct) return 0;
  return subtotal * (parseFloat(taxPct) / 100);
}

function buildInvoiceMessage(booking, invoice) {
  const name = booking.customer_name || 'there';
  const currency = invoice.currency || 'IDR';
  const total = Number(invoice.amount || 0).toLocaleString('id-ID');
  const due = invoice.due_date ? format(new Date(invoice.due_date), 'dd MMM yyyy') : null;
  const lines = [
    `Hello ${name}!`,
    '',
    'Thank you for choosing Vegatours.',
    '',
    'Here are the details for your invoice:',
    '',
    `- ${invoice.label || 'Invoice'} — ${invoice.invoice_number || ''}`,
    `- Total Due: ${currency} ${total}`,
  ];
  if (due) lines.push(`- Due Date: ${due}`);
  if (invoice.notes) lines.push(`- ${invoice.notes}`);
  lines.push(
    '',
    'Please let us know if you have any questions. We look forward to serving you!',
    '',
    'Best regards,',
    'Vegatours Team'
  );
  return lines.join('\n');
}

export default function InvoicesPanel({ booking }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);
  const queryClient = useQueryClient();

  const { data: paySettings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_settings').select('*').order('key', { ascending: true });
      if (error) throw error;
      const m = {};
      (data || []).forEach(r => { m[r.key] = r.value; });
      return m;
    },
    initialData: {},
  });

  const { data: invoices } = useQuery({
    queryKey: ['invoices', booking.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('booking_id', booking.id)
        .order('created_date', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    initialData: [],
  });

  const subtotal = calcSubtotal(form.line_items || []);
  const taxAmount = calcTax(subtotal, form.tax_percentage);
  const total = subtotal + taxAmount;

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const invNum = `INV-${booking.booking_code || booking.id.slice(-6)}-${Date.now().toString().slice(-4)}`;
      const items = (data.line_items || []).map(it => ({ ...it, amount: parseFloat(it.amount) || 0 }));
      const sub = items.reduce((s, it) => s + it.amount, 0);
      const tax = sub * ((parseFloat(data.tax_percentage) || 0) / 100);
      const computedTotal = sub + tax;
      const payload = {
        ...data,
        line_items: items,
        tax_percentage: parseFloat(data.tax_percentage) || null,
        amount: computedTotal,
      };
      
      if (editing?.id) {
        const { error } = await supabase.from('invoices').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('invoices').insert({ ...payload, booking_id: booking.id, invoice_number: invNum });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices', booking.id] });
      toast.success('Invoice saved');
      setOpen(false);
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('invoices').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices', booking.id] });
      toast.success('Invoice deleted');
    },
  });

  const openNew = () => { setEditing(null); setForm(BLANK); setOpen(true); };
  const openEdit = (inv) => {
    setEditing(inv);
    setForm({
      ...inv,
      line_items: inv.line_items?.length ? inv.line_items : [{ description: '', amount: '' }],
      tax_percentage: inv.tax_percentage || '',
    });
    setOpen(true);
  };

  const handleDownload = (inv) => {
    generateInvoicePDF(booking, inv, paySettings || {});
  };

  const handleSendWhatsApp = (inv) => {
    if (!booking.customer_phone) {
      toast.error('No customer phone number on this booking');
      return;
    }
    const msg = buildInvoiceMessage(booking, inv);
    window.open(whatsappSendTo(booking.customer_phone, msg), '_blank');
  };

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const setLineItem = (i, k, v) => {
    const items = [...(form.line_items || [])];
    items[i] = { ...items[i], [k]: v };
    set('line_items', items);
  };

  const addLineItem = () => set('line_items', [...(form.line_items || []), { description: '', amount: '' }]);
  const removeLineItem = (i) => set('line_items', form.line_items.filter((_, idx) => idx !== i));

  const fmt = (n) => Number(n || 0).toLocaleString('id-ID');

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Invoices</h3>
        <Button size="sm" onClick={openNew} className="bg-primary text-primary-foreground rounded-xl gap-1.5 text-xs">
          <Plus className="w-3.5 h-3.5" /> New Invoice
        </Button>
      </div>

      {invoices.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6 bg-secondary/30 rounded-xl">No invoices yet. Click "New Invoice" to create one.</p>
      ) : (
        <div className="space-y-3">
          {invoices.map(inv => (
            <div key={inv.id} className="flex items-center justify-between gap-3 p-4 bg-secondary/30 rounded-xl border border-border/30">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Receipt className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="font-medium text-sm text-foreground">{inv.label || 'Invoice'}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[inv.status] || 'bg-secondary'}`}>{inv.status}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-mono">{inv.invoice_number}</p>
                <p className="text-sm font-bold text-foreground mt-1">
                  {inv.currency} {Number(inv.amount || 0).toLocaleString('id-ID')}
                </p>
                {inv.due_date && <p className="text-xs text-muted-foreground">Due: {format(new Date(inv.due_date), 'dd MMM yyyy')}</p>}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(inv)} title="Edit" className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors text-xs">Edit</button>
                <button onClick={() => handleDownload(inv)} title="Download PDF" className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button onClick={() => handleSendWhatsApp(inv)} title="Send via WhatsApp" className="p-1.5 rounded-lg text-muted-foreground hover:text-green-600 hover:bg-green-50 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button onClick={() => { if(window.confirm('Delete invoice?')) deleteMutation.mutate(inv.id); }}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Invoice' : 'New Invoice'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={e => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-5 mt-2">

            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest pb-1">Invoice Details</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label className="text-xs text-muted-foreground mb-1 block">Invoice Label</Label>
                <Select value={form.label} onValueChange={v => set('label', v)}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{LABELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Currency</Label>
                <Select value={form.currency || 'IDR'} onValueChange={v => set('currency', v)}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Due Date</Label>
                <Input type="date" value={form.due_date || ''} onChange={e => set('due_date', e.target.value)} className="rounded-xl" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Status</Label>
                <Select value={form.status || 'unpaid'} onValueChange={v => set('status', v)}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{['unpaid','paid','overdue','cancelled'].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Payment Method</Label>
                <Select value={form.payment_method || 'bank_transfer'} onValueChange={v => set('payment_method', v)}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{METHODS.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            {/* Line Items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs font-semibold text-foreground uppercase tracking-wide">Line Items</Label>
                <Button type="button" size="sm" variant="outline" onClick={addLineItem} className="rounded-lg text-xs h-7 gap-1">
                  <Plus className="w-3 h-3" /> Add Item
                </Button>
              </div>
              <div className="space-y-2">
                {/* Header row */}
                <div className="grid grid-cols-[1fr_120px_28px] gap-2 px-1">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase">Description</span>
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase">Amount</span>
                  <span />
                </div>
                {(form.line_items || []).map((item, i) => (
                  <div key={i} className="grid grid-cols-[1fr_120px_28px] gap-2 items-center">
                    <Input
                      placeholder="e.g. Tour Package Ubud"
                      value={item.description}
                      onChange={e => setLineItem(i, 'description', e.target.value)}
                      className="rounded-lg text-sm h-9"
                      required
                    />
                    <Input
                      type="number"
                      placeholder="0"
                      value={item.amount}
                      onChange={e => setLineItem(i, 'amount', e.target.value)}
                      className="rounded-lg text-sm h-9"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeLineItem(i)}
                      disabled={form.line_items.length === 1}
                      className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-30"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest pb-1">Payment Summary</div>
            <div className="grid grid-cols-2 gap-3 p-3 bg-secondary/40 rounded-xl">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Tax % (optional)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="e.g. 11"
                  value={form.tax_percentage}
                  onChange={e => set('tax_percentage', e.target.value)}
                  className="rounded-lg h-9"
                />
              </div>
              <div className="flex flex-col justify-end text-right text-sm space-y-1 pb-1">
                <p className="text-muted-foreground">Subtotal: <span className="font-medium text-foreground">{form.currency} {fmt(subtotal)}</span></p>
                {form.tax_percentage > 0 && (
                  <p className="text-muted-foreground">Tax ({form.tax_percentage}%): <span className="font-medium text-foreground">{form.currency} {fmt(taxAmount)}</span></p>
                )}
                <p className="font-bold text-foreground border-t border-border pt-1">Total: {form.currency} {fmt(total)}</p>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Notes</Label>
              <Textarea value={form.notes || ''} onChange={e => set('notes', e.target.value)} rows={2} className="rounded-xl resize-none" />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saveMutation.isPending} className="bg-primary text-primary-foreground rounded-xl">
                {saveMutation.isPending ? 'Saving...' : 'Save Invoice'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}