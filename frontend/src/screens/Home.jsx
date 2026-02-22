import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  FileText,
  Trash2,
  Copy,
  Eye,
  Edit3,
  Search,
  Grid,
  List,
  Calendar
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';

const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [forms, setForms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/forms`);
      const data = await res.json();

 
      const normalized = data.map(form => ({
        id: form._id,
        title: form.title,
        description: form.description,
        questions: form.questions?.length || 0,
        responses: form.responsesCount || 0,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
      }));

      setForms(normalized);
    } catch (err) {
      console.error('Failed to fetch forms', err);
      toast({
        title: 'Error',
        description: 'Failed to load forms.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleCreateForm = () => {
    navigate(`/builder/new`);
  };

  const handleEditForm = (formId) => {
    navigate(`/builder/${formId}`);
  };

  const handleViewForm = (formId) => {
    navigate(`/form/${formId}`);
  };

  const handleDuplicateForm = async (formId) => {
    try {
      const res = await fetch(`${API_BASE}/forms/${formId}`);
      const original = await res.json();

      const duplicated = {
        title: `${original.title} (Copy)`,
        description: original.description,
        questions: original.questions,
      };

      await fetch(`${API_BASE}/forms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicated),
      });

      toast({
        title: 'Form duplicated',
        description: 'A copy of the form has been created.',
      });

      fetchForms();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to duplicate form.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteForm = async (formId) => {
    try {
      await fetch(`${API_BASE}/forms/${formId}`, {
        method: 'DELETE',
      });

      toast({
        title: 'Form deleted',
        description: 'The form has been removed.',
      });

      fetchForms();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete form.',
        variant: 'destructive',
      });
    }
  };

  const filteredForms = forms.filter(form =>
    form.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-sky-200/70">

      {/* HEADER */}
      <header className="border-b border-primary/20 bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary-dark">My Forms</h1>
            <p className="text-muted-foreground">
              Create and manage your forms
            </p>
          </div>
          <Button
            onClick={handleCreateForm}
            size="lg"
            className="gap-2 bg-gradient-primary text-white"
          >
            <Plus className="h-5 w-5" />
            Create Form
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-8">

        {/* SEARCH */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <Input
              placeholder="Search forms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex border rounded-lg p-1 bg-white">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-20">Loading forms...</div>
        ) : filteredForms.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow">
            <FileText className="h-16 w-16 mx-auto text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {searchQuery ? 'No forms found' : 'No forms yet'}
            </h2>
            <p className="text-muted-foreground">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Create your first form to get started'}
            </p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredForms.map((form, index) => (
              <motion.div
                key={form.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-primary-dark">
                    {form.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {form.description}
                  </p>
                </div>

                <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                  <span>{form.questions} questions</span>
                  <span>{form.responses} responses</span>
                </div>

                <div className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Updated {formatDate(form.updatedAt)}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleEditForm(form.id)}
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewForm(form.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicateForm(form.id)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/responses/${form.id}`)}
                    className="border-primary/30 hover:bg-primary/5 text-primary"
                  >
                    View
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteForm(form.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;