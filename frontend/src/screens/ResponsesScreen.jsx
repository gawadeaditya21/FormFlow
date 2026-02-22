import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ResponsesScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [responses, setResponses] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formRes = await fetch(`${API_BASE}/forms/${id}`);
        const formData = await formRes.json();
        setForm(formData);

        const resRes = await fetch(`${API_BASE}/forms/${id}/responses`);
        const resData = await resRes.json();
        setResponses(resData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-200/70">
        Loading responses...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-200/70 py-10 px-4">

      <div className="max-w-4xl mx-auto">

        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-primary/10 overflow-hidden"
        >

          <div className="h-3 bg-gradient-primary" />

          <div className="p-6 md:p-8">
            <h1 className="text-2xl font-bold text-primary-dark mb-2">
              {form?.title}
            </h1>
            <p className="text-muted-foreground mb-6">
              {responses.length} responses collected
            </p>

            {responses.length === 0 ? (
              <div className="text-muted-foreground">
                No responses yet.
              </div>
            ) : (
              <div className="space-y-6">
                {responses.map((response, index) => (
                  <motion.div
                    key={response._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-primary/5 p-4 rounded-xl border border-primary/10"
                  >
                    <div className="text-sm text-muted-foreground mb-3">
                      Response #{responses.length - index}
                    </div>

                    {response.answers.map((ans) => {
                      const question = form.questions.find(
                        q => q.id === ans.questionId
                      );

                      return (
                        <div key={ans.questionId} className="mb-2">
                          <div className="font-medium text-primary-dark">
                            {question?.label}
                          </div>
                          <div className="text-muted-foreground">
                            {Array.isArray(ans.value)
                              ? ans.value.join(', ')
                              : ans.value}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default ResponsesScreen;