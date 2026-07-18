import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserPlus, Mail, Shield, User, MoreVertical, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const ROLE_LABELS = { admin: 'Admin', user: 'User' };
const ROLE_COLORS = { admin: 'bg-primary/10 text-primary', user: 'bg-secondary text-secondary-foreground' };

export default function AdminUsers() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'user' });
  const [inviting, setInviting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_date', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    initialData: [],
  });

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user "${user.full_name || user.email}"? This cannot be undone.`)) return;
    setDeletingId(user.id);
    try {
      const { error } = await supabase.from('users').delete().eq('id', user.id);
      if (error) throw error;
      toast.success('User deleted');
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
    }
    setDeletingId(null);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviting(true);
    try {
      // Send invitation via Supabase Auth
      const { data, error } = await supabase.auth.admin.inviteUserByEmail(inviteForm.email, {
        data: { role: inviteForm.role }
      });
      if (error) throw error;
      toast.success(`Invitation sent to ${inviteForm.email}`);
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setInviteOpen(false);
      setInviteForm({ email: '', role: 'user' });
    } catch (err) {
      toast.error(err.message || 'Failed to send invitation');
    }
    setInviting(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Users</h1>
          <p className="text-muted-foreground mt-1">Manage admin users and send invitations</p>
        </div>
        <Button onClick={() => setInviteOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gap-2">
          <UserPlus className="w-4 h-4" /> Invite User
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Joined</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-primary">{u.full_name?.[0] || '?'}</span>
                      </div>
                      <span className="font-medium text-foreground text-sm">{u.full_name || '—'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="text-sm text-muted-foreground">{u.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[u.role] || 'bg-secondary text-secondary-foreground'}`}>
                      {ROLE_LABELS[u.role] || u.role || 'user'}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {u.created_date ? format(new Date(u.created_date), 'dd MMM yyyy') : '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(u)}
                      disabled={deletingId === u.id}
                      className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No users found</div>
          )}
        </div>
      )}

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" /> Invite New User
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInvite} className="space-y-4 mt-4">
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Email Address</Label>
              <Input
                type="email"
                required
                placeholder="user@example.com"
                value={inviteForm.email}
                onChange={e => setInviteForm(p => ({ ...p, email: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Role</Label>
              <Select value={inviteForm.role} onValueChange={val => setInviteForm(p => ({ ...p, role: val }))}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin — full CMS access</SelectItem>
                  <SelectItem value="user">User — limited access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground bg-secondary/50 rounded-xl p-3">
              An invitation email will be sent. The user can activate their account via the link provided.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => setInviteOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={inviting} className="bg-primary text-primary-foreground rounded-xl gap-2">
                <Mail className="w-4 h-4" /> {inviting ? 'Sending...' : 'Send Invitation'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}