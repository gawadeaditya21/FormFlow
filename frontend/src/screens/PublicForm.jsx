import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { FileText } from 'lucide-react';

const API_BASE =
    import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PublicForm = () => {
    const { token } = useParams();
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const res = await fetch(`${API_BASE}/forms/share/${token}`);
                const data = await res.json();
                setForm(data);
            } catch (err) {
                console.error('Failed to fetch shared form', err);
            } finally {
                setLoading(false);
            }
        };

        fetchForm();
    }, [token]);

    const handleChange = (questionId, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await fetch(`${API_BASE}/forms/${form._id}/responses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    answers: Object.entries(answers).map(([questionId, value]) => ({
                        questionId,
                        value
                    }))
                })
            });

            alert('Response submitted successfully 🎉');
            setAnswers({});
        } catch (err) {
            alert('Failed to submit response');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-sky-200/70">
                <div className="text-primary-dark font-medium">
                    Loading form...
                </div>
            </div>
        );
    }

    if (!form) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-sky-200/70">
                <div className="text-destructive font-medium">
                    Form not found
                </div>
            </div>
        );
    }

    console.log(form.questions);
    return (
        <div className="min-h-screen bg-sky-200/70 py-10 px-4">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-primary/10 overflow-hidden"
            >

                {/* Top Accent Bar */}
                <div className="h-3 bg-gradient-primary" />

                <div className="p-6 md:p-8">

                    {/* Header */}
                    <div className="flex items-start gap-3 mb-6">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-primary-dark">
                                {form.title}
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                {form.description}
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {form.questions?.map((q, index) => (
                            <motion.div
                                key={q.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-primary/5 p-4 rounded-xl border border-primary/10"
                            >
                                <label className="block font-medium text-primary-dark mb-2">
                                    {q.label}
                                    {q.required && (
                                        <span className="text-destructive ml-1">*</span>
                                    )}
                                </label>

                                {/* SHORT TEXT */}
                                {q.type === 'short-text' && (
                                    <Input
                                        value={answers[q.id] || ''}
                                        onChange={(e) =>
                                            handleChange(q.id, e.target.value)
                                        }
                                        placeholder="Your answer..."
                                    />
                                )}

                                {/* DROPDOWN */}
                                {q.type === 'dropdown' && (
                                    <select
                                        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={answers[q.id] || ''}
                                        onChange={(e) =>
                                            handleChange(q.id, e.target.value)
                                        }
                                    >
                                        <option value="">Select an option</option>
                                        {q.options?.map((opt) => (
                                            <option key={opt.id} value={opt.value}>
                                                {opt.value}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                {/* CHECKBOX */}
                                {q.type === 'checkbox' && (
                                    <div className="space-y-2">
                                        {q.options?.map((opt) => (
                                            <label
                                                key={opt.id}
                                                className="flex items-center gap-2 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={opt.value}
                                                    checked={
                                                        answers[q.id]?.includes(opt.value) || false
                                                    }
                                                    onChange={(e) => {
                                                        const prev = answers[q.id] || [];
                                                        if (e.target.checked) {
                                                            handleChange(q.id, [...prev, opt.value]);
                                                        } else {
                                                            handleChange(
                                                                q.id,
                                                                prev.filter(v => v !== opt.value)
                                                            );
                                                        }
                                                    }}
                                                    className="accent-primary"
                                                />
                                                <span>{opt.value}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                            </motion.div>
                        ))}

                        {/* Submit */}
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full bg-gradient-primary text-white hover:opacity-90 shadow-lg"
                        >
                            Submit Response
                        </Button>

                    </form>

                </div>
            </motion.div>
        </div>
    );
};

export default PublicForm;