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

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [forms, setForms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const savedForms = localStorage.getItem('forms');
    if (savedForms) {
      setForms(JSON.parse(savedForms));
    } else {
      const mockForms = [
        {
          id: '1',
          title: 'Customer Feedback Form',
          description: 'Collect customer feedback and suggestions',
          questions: 5,
          responses: 23,
          createdAt: new Date('2026-01-01').toISOString(),
          updatedAt: new Date('2026-01-02').toISOString(),
        },
        {
          id: '2',
          title: 'Event Registration',
          description: 'Register for our upcoming event',
          questions: 8,
          responses: 45,
          createdAt: new Date('2025-12-28').toISOString(),
          updatedAt: new Date('2026-01-03').toISOString(),
        },
      ];
      setForms(mockForms);
      localStorage.setItem('forms', JSON.stringify(mockForms));
    }
  }, []);

  useEffect(() => {
    if (forms.length > 0) {
      localStorage.setItem('forms', JSON.stringify(forms));
    }
  }, [forms]);

  const handleCreateForm = () => {
    const newFormId = Date.now().toString();
    navigate(`/builder/${newFormId}`);
    toast({
      title: "Creating new form",
      description: "Starting a new form builder session.",
    });
  };

  const handleEditForm = (formId) => {
    navigate(`/builder/${formId}`);
  };

  const handleViewForm = (formId) => {
    navigate(`/form/${formId}`);
  };

  const handleDuplicateForm = (formId) => {
    const formToDuplicate = forms.find(f => f.id === formId);
    if (formToDuplicate) {
      const duplicatedForm = {
        ...formToDuplicate,
        id: Date.now().toString(),
        title: `${formToDuplicate.title} (Copy)`,
        responses: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setForms([...forms, duplicatedForm]);
      toast({
        title: "Form duplicated",
        description: "A copy of the form has been created.",
      });
    }
  };

  const handleDeleteForm = (formId) => {
    setForms(forms.filter(f => f.id !== formId));
    toast({
      title: "Form deleted",
      description: "The form has been removed.",
      variant: "destructive",
    });
  };

  const filteredForms = forms.filter(form =>
    form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-sky-200/70">
      {/* Header */}
      <header className="border-b border-primary/20 bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary-dark">My Forms</h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                Create and manage your forms
              </p>
            </div>
            <Button onClick={handleCreateForm} size="lg" className="gap-2 bg-gradient-primary hover:opacity-90 text-white shadow-lg w-full md:w-auto">
              <Plus className="h-5 w-5" />
              Create Form
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="relative flex-1 max-w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
            <Input
              type="text"
              placeholder="Search forms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-primary/30 focus:border-primary"
            />
          </div>
          
          <div className="flex items-center gap-2 border border-primary/30 rounded-lg p-1 bg-white w-fit">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-primary text-white' : 'text-primary-dark'}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-primary text-white' : 'text-primary-dark'}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Forms Grid/List */}
        {filteredForms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 md:py-20 bg-white rounded-2xl shadow-sm border border-primary/10"
          >
            <FileText className="h-16 w-16 md:h-20 md:w-20 mx-auto text-primary mb-4" />
            <h2 className="text-xl md:text-2xl font-semibold mb-2 text-primary-dark">
              {searchQuery ? 'No forms found' : 'No forms yet'}
            </h2>
            <p className="text-muted-foreground mb-6 px-4">
              {searchQuery 
                ? 'Try adjusting your search query'
                : 'Create your first form to get started'
              }
            </p>
            {!searchQuery && (
              <Button onClick={handleCreateForm} size="lg" className="gap-2 bg-gradient-primary text-white shadow-lg">
                <Plus className="h-5 w-5" />
                Create Your First Form
              </Button>
            )}
          </motion.div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'
              : 'space-y-4'
          }>
            {filteredForms.map((form, index) => (
              <motion.div
                key={form.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-primary/10 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group"
              >
                <div className="h-2 bg-gradient-primary" />
                
                <div className="p-5 md:p-6">
                  {/* Form Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-semibold mb-1 group-hover:text-primary transition-colors text-primary-dark">
                        {form.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {form.description}
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-primary/20 shrink-0 ml-2" />
                  </div>

                  {/* Form Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>{form.questions} questions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-primary" />
                      <span>{form.responses} responses</span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4 bg-primary/5 px-3 py-2 rounded-lg">
                    <Calendar className="h-3 w-3 text-primary" />
                    <span>Updated {formatDate(form.updatedAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-primary/10">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleEditForm(form.id)}
                      className="flex-1 bg-primary hover:bg-primary-dark text-white"
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewForm(form.id)}
                      className="border-primary/30 hover:bg-primary/5 text-primary"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicateForm(form.id)}
                      className="border-primary/30 hover:bg-primary/5 text-primary"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteForm(form.id)}
                      className="border-destructive/30 hover:bg-destructive/10 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
