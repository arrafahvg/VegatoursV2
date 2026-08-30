import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, GripVertical, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateId } from '@/lib/utils';

function toSnakeCase(str) {
  return str
    .replace(/([A-Z])/g, (_, c) => `_${c.toLowerCase()}`)
    .replace(/^_/, '');
}

export default function EntityManager({ entityName, queryKey, fields, renderCard, tableName, missingFieldWarning, searchKeys, filters }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const queryClient = useQueryClient();

  const table = tableName || toSnakeCase(entityName);

  const { data: items, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select('*').order('sort_order', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    initialData: [],
  });

  const hasSearch = Array.isArray(searchKeys) && searchKeys.length > 0;
  const filterDefs = Array.isArray(filters) ? filters : [];
  const hasToolbar = hasSearch || filterDefs.length > 0;

  const filteredItems = items.filter(item => {
    if (hasSearch && search) {
      const q = search.toLowerCase();
      const hit = searchKeys.some(key => String(item[key] ?? '').toLowerCase().includes(q));
      if (!hit) return false;
    }
    return filterDefs.every(f => {
      const value = filterValues[f.key] ?? 'all';
      if (value === 'all') return true;
      return f.match ? f.match(item, value) : String(item[f.key] ?? '') === value;
    });
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      // Every table uses a VARCHAR(24) primary key with no default — generate one,
      // otherwise the insert fails with a NOT NULL violation (same bug as bookings).
      const { error } = await supabase.from(table).insert({ id: generateId(), ...data });
      if (error) throw error;
    },
    onError: (err) => {
      toast.error(err?.message || 'Create failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success('Created successfully');
      closeDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const { error } = await supabase.from(table).update(data).eq('id', id);
      if (error) throw error;
    },
    onError: (err) => {
      toast.error(err?.message || 'Update failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success('Updated successfully');
      closeDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
    },
    onError: (err) => {
      toast.error(err?.message || 'Delete failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success('Deleted successfully');
    },
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
    setFormData({});
  };

  const openCreate = () => {
    setEditing(null);
    setFormData({});
    setDialogOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setFormData({ ...item });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleFileUpload = async (field, file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${entityName.toLowerCase()}_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('public').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('public').getPublicUrl(fileName);
      setFormData(prev => ({ ...prev, [field]: data.publicUrl }));
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    }
  };

  const updateField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Detect whether the admin is missing expected column(s) (e.g. is_available),
  // because then saving the toggle would silently fail. Show a helpful banner.
  const missingColumns = (missingFieldWarning || [])
    .filter(key => items.length > 0 && items.every(item => !(key in item)));

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold text-foreground">{entityName.replace(/([A-Z])/g, ' $1').trim()}s</h2>
        <Button onClick={openCreate} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gap-2 h-11">
          <Plus className="w-4 h-4" /> Add New
        </Button>
      </div>

      {hasToolbar && (
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {hasSearch && (
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={`Search ${entityName.toLowerCase()}s...`}
                className="pl-9 rounded-xl"
              />
            </div>
          )}
          {filterDefs.map(f => {
            const options = typeof f.options === 'function' ? f.options(items) : f.options;
            return (
              <Select
                key={f.key}
                value={filterValues[f.key] ?? 'all'}
                onValueChange={v => setFilterValues(prev => ({ ...prev, [f.key]: v }))}
              >
                <SelectTrigger className="rounded-xl w-auto min-w-[140px]">
                  <SelectValue placeholder={f.label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{f.allLabel || `All ${f.label}`}</SelectItem>
                  {options.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          })}
        </div>
      )}

      {missingColumns.length > 0 && (
        <div className="mb-6 p-4 rounded-xl border-2 border-amber-300 bg-amber-50 text-amber-800 text-sm leading-relaxed">
          <p className="font-semibold mb-1">
            The '{missingColumns.join(', ')}' column doesn't exist yet in your Supabase database.
          </p>
          <p>
            The availability toggle won't save until migration <code>007_add_is_available_to_bikes.sql</code>{' '}
            is applied. Open your Supabase project → SQL Editor and run:
            <code className="block mt-1 bg-amber-100 px-2 py-1 rounded">
              ALTER TABLE public.bikes ADD COLUMN IF NOT EXISTS is_available BOOLEAN NOT NULL DEFAULT true;
            </code>
            then refresh this page.
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : filteredItems.length === 0 ? (
        items.length > 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground">No items match your search or filters</p>
          </div>
        ) : (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
          <p className="text-muted-foreground mb-4">No items yet</p>
          <Button onClick={openCreate} variant="outline" className="rounded-xl gap-2">
            <Plus className="w-4 h-4" /> Add First Item
          </Button>
        </div>
        )
      ) : (
        <div className="space-y-3">
          {filteredItems.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-4 bg-card border border-border/50 rounded-xl">
              <GripVertical className="w-4 h-4 text-muted-foreground/50 flex-shrink-0 hidden sm:block" />
              <div className="flex-1 min-w-0">
                {renderCard(item)}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button variant="ghost" size="icon" onClick={() => openEdit(item)} className="h-10 w-10 text-muted-foreground hover:text-foreground" aria-label="Edit">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(item.id)} className="h-10 w-10 text-muted-foreground hover:text-destructive" aria-label="Delete">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg w-[calc(100vw-1.5rem)] max-h-[90dvh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit' : 'Add'} {entityName.replace(/([A-Z])/g, ' $1').trim()}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {fields.filter(f => !(f.hidden && f.hidden(formData))).map(field => (
              <div key={field.key}>
                <Label className="text-sm font-medium mb-1.5 block">{field.label}</Label>
                {field.type === 'text' && (
                  <Input
                    value={formData[field.key] || ''}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="rounded-xl"
                  />
                )}
                {field.type === 'textarea' && (
                  <Textarea
                    value={formData[field.key] || ''}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="rounded-xl"
                  />
                )}
                {field.type === 'number' && (
                  <Input
                    type="number"
                    value={formData[field.key] ?? ''}
                    onChange={(e) => updateField(field.key, parseFloat(e.target.value) || 0)}
                    className="rounded-xl"
                  />
                )}
                {field.type === 'boolean' && (
                  <Switch
                    checked={formData[field.key] || false}
                    onCheckedChange={(val) => updateField(field.key, val)}
                  />
                )}
                {field.type === 'image' && (
                  <div className="space-y-2">
                    {formData[field.key] && (
                      <img src={formData[field.key]} alt="" className="w-full h-32 object-cover rounded-xl" />
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files[0] && handleFileUpload(field.key, e.target.files[0])}
                      className="rounded-xl"
                    />
                  </div>
                )}
                {field.type === 'array' && (
                  <div className="space-y-2">
                    {(formData[field.key] || []).map((item, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          value={item}
                          onChange={(e) => {
                            const arr = [...(formData[field.key] || [])];
                            arr[idx] = e.target.value;
                            updateField(field.key, arr);
                          }}
                          className="rounded-xl"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const arr = (formData[field.key] || []).filter((_, i) => i !== idx);
                            updateField(field.key, arr);
                          }}
                          className="h-10 w-10 text-destructive flex-shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateField(field.key, [...(formData[field.key] || []), ''])}
                      className="rounded-xl gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Item
                    </Button>
                  </div>
                )}
              </div>
            ))}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
              <Button variant="outline" onClick={closeDialog} disabled={saving} className="rounded-xl h-11">Cancel</Button>
              <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11 gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Saving...' : (editing ? 'Update' : 'Create')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}