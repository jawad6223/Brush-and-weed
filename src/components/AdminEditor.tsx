import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, SiteSection, SiteFeature, SiteStep } from '../lib/supabase';
import { Save, LogOut, Image as ImageIcon, FileText, List, Settings } from 'lucide-react';
import Logo from './Logo';

type Tab = 'sections' | 'features' | 'steps';

export default function AdminEditor() {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('sections');
  const [sections, setSections] = useState<SiteSection[]>([]);
  const [features, setFeatures] = useState<SiteFeature[]>([]);
  const [steps, setSteps] = useState<SiteStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [sectionsRes, featuresRes, stepsRes] = await Promise.all([
      supabase.from('site_sections').select('*').order('section_key'),
      supabase.from('site_features').select('*').order('order_index'),
      supabase.from('site_steps').select('*').order('section, order_index'),
    ]);

    if (sectionsRes.data) setSections(sectionsRes.data);
    if (featuresRes.data) setFeatures(featuresRes.data);
    if (stepsRes.data) setSteps(stepsRes.data);
    setLoading(false);
  };

  const handleSaveSections = async () => {
    setSaving(true);
    setMessage('');

    for (const section of sections) {
      const { error } = await supabase
        .from('site_sections')
        .update({
          title: section.title,
          subtitle: section.subtitle,
          description: section.description,
          image_url: section.image_url,
          cta_text: section.cta_text,
          cta_secondary_text: section.cta_secondary_text,
          updated_at: new Date().toISOString(),
        })
        .eq('id', section.id);

      if (error) {
        setMessage(`Error saving: ${error.message}`);
        setSaving(false);
        return;
      }
    }

    setMessage('Sections saved successfully!');
    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSaveFeatures = async () => {
    setSaving(true);
    setMessage('');

    for (const feature of features) {
      const { error } = await supabase
        .from('site_features')
        .update({
          title: feature.title,
          description: feature.description,
          icon_name: feature.icon_name,
          order_index: feature.order_index,
          updated_at: new Date().toISOString(),
        })
        .eq('id', feature.id);

      if (error) {
        setMessage(`Error saving: ${error.message}`);
        setSaving(false);
        return;
      }
    }

    setMessage('Features saved successfully!');
    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSaveSteps = async () => {
    setSaving(true);
    setMessage('');

    for (const step of steps) {
      const { error } = await supabase
        .from('site_steps')
        .update({
          title: step.title,
          description: step.description,
          step_number: step.step_number,
          section: step.section,
          order_index: step.order_index,
          updated_at: new Date().toISOString(),
        })
        .eq('id', step.id);

      if (error) {
        setMessage(`Error saving: ${error.message}`);
        setSaving(false);
        return;
      }
    }

    setMessage('Steps saved successfully!');
    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const updateSection = (id: string, field: keyof SiteSection, value: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const updateFeature = (id: string, field: keyof SiteFeature, value: string | number) => {
    setFeatures(features.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const updateStep = (id: string, field: keyof SiteStep, value: string | number) => {
    setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo size="small" />
            <span className="text-gray-400">|</span>
            <h1 className="text-xl font-semibold text-gray-700">Content Editor</h1>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {message && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {message}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-1 p-2">
              <button
                onClick={() => setActiveTab('sections')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'sections'
                    ? 'bg-green-700 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FileText className="h-5 w-5" />
                <span>Sections</span>
              </button>
              <button
                onClick={() => setActiveTab('features')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'features'
                    ? 'bg-green-700 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="h-5 w-5" />
                <span>Features</span>
              </button>
              <button
                onClick={() => setActiveTab('steps')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'steps'
                    ? 'bg-green-700 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Settings className="h-5 w-5" />
                <span>Steps</span>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'sections' && (
              <div className="space-y-8">
                {sections.map((section) => (
                  <div key={section.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 capitalize">{section.section_key} Section</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                      <input
                        type="text"
                        value={section.subtitle}
                        onChange={(e) => updateSection(section.id, 'subtitle', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={section.description}
                        onChange={(e) => updateSection(section.id, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <ImageIcon className="inline h-4 w-4 mr-1" />
                        Image URL
                      </label>
                      <input
                        type="text"
                        value={section.image_url}
                        onChange={(e) => updateSection(section.id, 'image_url', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="https://images.pexels.com/..."
                      />
                      {section.image_url && (
                        <img src={section.image_url} alt="Preview" className="mt-2 h-32 object-cover rounded-lg" />
                      )}
                    </div>

                    {section.section_key === 'hero' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Button Text</label>
                          <input
                            type="text"
                            value={section.cta_text}
                            onChange={(e) => updateSection(section.id, 'cta_text', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Button Text</label>
                          <input
                            type="text"
                            value={section.cta_secondary_text}
                            onChange={(e) => updateSection(section.id, 'cta_secondary_text', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}

                <button
                  onClick={handleSaveSections}
                  disabled={saving}
                  className="w-full flex items-center justify-center space-x-2 bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  <span>{saving ? 'Saving...' : 'Save Sections'}</span>
                </button>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="space-y-8">
                {features.map((feature) => (
                  <div key={feature.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) => updateFeature(feature.id, 'title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={feature.description}
                        onChange={(e) => updateFeature(feature.id, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icon Name (Lucide React)
                      </label>
                      <input
                        type="text"
                        value={feature.icon_name}
                        onChange={(e) => updateFeature(feature.id, 'icon_name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Leaf, DollarSign, etc."
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleSaveFeatures}
                  disabled={saving}
                  className="w-full flex items-center justify-center space-x-2 bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  <span>{saving ? 'Saving...' : 'Save Features'}</span>
                </button>
              </div>
            )}

            {activeTab === 'steps' && (
              <div className="space-y-8">
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> Steps are grouped by section. "how-it-works" section shows the main process,
                    "technology" section explains GPS technology.
                  </p>
                </div>

                {steps.map((step) => (
                  <div key={step.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
                    <div className="flex items-center space-x-4">
                      <span className="bg-green-700 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Step {step.step_number}
                      </span>
                      <span className="text-sm text-gray-600 capitalize">Section: {step.section}</span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={step.description}
                        onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleSaveSteps}
                  disabled={saving}
                  className="w-full flex items-center justify-center space-x-2 bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  <span>{saving ? 'Saving...' : 'Save Steps'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
