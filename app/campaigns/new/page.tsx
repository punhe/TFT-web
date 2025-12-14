'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader, Input, Textarea, Button, Progress } from '@heroui/react';
import { FiPlus, FiX, FiMail, FiUser, FiFileText, FiArrowRight, FiArrowLeft, FiCheck, FiSend } from 'react-icons/fi';
import { m, AnimatePresence } from 'framer-motion';

const steps = [
  { id: 1, title: 'Basic Info', icon: FiFileText },
  { id: 2, title: 'Sender Details', icon: FiUser },
  { id: 3, title: 'Email Content', icon: FiMail },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    from_email: '',
    from_name: '',
    html_content: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const campaign = await response.json();
        router.push(`/campaigns/${campaign.id}`);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        const errorMessage = errorData.details || errorData.error || 'Failed to create campaign';
        const hint = errorData.hint ? `\n\n${errorData.hint}` : '';
        alert(`${errorMessage}${hint}`);
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Error creating campaign. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.subject;
      case 2:
        return formData.from_name && formData.from_email;
      case 3:
        return formData.html_content;
      default:
        return false;
    }
  };

  return (
    <div className="container max-w-3xl">
      {/* Header */}
      <m.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-6 bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
          
          <CardHeader className="relative flex flex-col gap-4 p-6">
            <div className="flex items-center gap-4">
              <m.div 
                className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg shadow-primary/20"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <FiPlus size={24} className="text-white" />
              </m.div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Create new campaign
                </h1>
                <p className="text-gray-500 mt-1">Set the basics so you can start sending in minutes.</p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mt-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <div key={step.id} className="flex items-center">
                    <m.div 
                      className={`
                        flex items-center gap-3 px-4 py-2 rounded-2xl transition-all
                        ${isActive ? 'bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20' : ''}
                        ${isCompleted ? 'text-success' : isActive ? 'text-primary' : 'text-gray-400'}
                      `}
                      animate={{ scale: isActive ? 1.05 : 1 }}
                    >
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center transition-all
                        ${isCompleted ? 'bg-success text-white' : isActive ? 'bg-gradient-to-r from-primary to-secondary text-white' : 'bg-gray-100'}
                      `}>
                        {isCompleted ? <FiCheck size={16} /> : <Icon size={16} />}
                      </div>
                      <span className={`font-medium hidden sm:block ${isActive ? 'text-gray-900' : ''}`}>
                        {step.title}
                      </span>
                    </m.div>
                    {index < steps.length - 1 && (
                      <div className={`w-8 sm:w-16 h-0.5 mx-2 rounded-full ${isCompleted ? 'bg-success' : 'bg-gray-200'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardHeader>
        </Card>
      </m.div>

      {/* Form Card */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-lg overflow-hidden">
          <CardBody className="p-6">
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <m.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mb-4">
                        <FiFileText className="text-3xl text-primary" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Campaign basics</h2>
                      <p className="text-gray-500 mt-1">Give your campaign a name and subject line</p>
                    </div>

                    <Input
                      label="Campaign Name"
                      placeholder="e.g., Summer Sale 2024"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      isRequired
                      variant="bordered"
                      size="lg"
                      classNames={{
                        inputWrapper: "bg-white/50 border-gray-200 hover:border-primary focus-within:border-primary rounded-2xl",
                        label: "text-gray-700 font-medium"
                      }}
                      description="This is for your reference only"
                    />

                    <Input
                      label="Email Subject"
                      placeholder="e.g., Special Offer Just for You!"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      isRequired
                      variant="bordered"
                      size="lg"
                      classNames={{
                        inputWrapper: "bg-white/50 border-gray-200 hover:border-primary focus-within:border-primary rounded-2xl",
                        label: "text-gray-700 font-medium"
                      }}
                      description="Recipients will see this in their inbox"
                    />
                  </m.div>
                )}

                {/* Step 2: Sender Details */}
                {currentStep === 2 && (
                  <m.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mb-4">
                        <FiUser className="text-3xl text-primary" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Sender information</h2>
                      <p className="text-gray-500 mt-1">Who is this email from?</p>
                    </div>

                    <Input
                      label="From Name"
                      placeholder="e.g., Your Company"
                      value={formData.from_name}
                      onChange={(e) => setFormData({ ...formData, from_name: e.target.value })}
                      isRequired
                      variant="bordered"
                      size="lg"
                      startContent={<FiUser className="text-gray-400" />}
                      classNames={{
                        inputWrapper: "bg-white/50 border-gray-200 hover:border-primary focus-within:border-primary rounded-2xl",
                        label: "text-gray-700 font-medium"
                      }}
                    />

                    <Input
                      label="From Email"
                      type="email"
                      placeholder="e.g., noreply@yourcompany.com"
                      value={formData.from_email}
                      onChange={(e) => setFormData({ ...formData, from_email: e.target.value })}
                      isRequired
                      variant="bordered"
                      size="lg"
                      startContent={<FiMail className="text-gray-400" />}
                      classNames={{
                        inputWrapper: "bg-white/50 border-gray-200 hover:border-primary focus-within:border-primary rounded-2xl",
                        label: "text-gray-700 font-medium"
                      }}
                    />
                  </m.div>
                )}

                {/* Step 3: Email Content */}
                {currentStep === 3 && (
                  <m.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mb-4">
                        <FiMail className="text-3xl text-primary" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Email content</h2>
                      <p className="text-gray-500 mt-1">Write your email in HTML format</p>
                    </div>

                    <Textarea
                      label="Email Content (HTML)"
                      placeholder={`<html>
<body>
  <h1>Hello!</h1>
  <p>Your email content here...</p>
  <a href="https://example.com">Click here</a>
</body>
</html>`}
                      value={formData.html_content}
                      onChange={(e) => setFormData({ ...formData, html_content: e.target.value })}
                      isRequired
                      variant="bordered"
                      minRows={12}
                      classNames={{
                        inputWrapper: "bg-white/50 border-gray-200 hover:border-primary focus-within:border-primary rounded-2xl",
                        input: "font-mono text-sm",
                        label: "text-gray-700 font-medium"
                      }}
                      description="You can use HTML tags and include links"
                    />
                  </m.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                <div>
                  {currentStep > 1 && (
                    <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="button"
                        variant="flat"
                        startContent={<FiArrowLeft />}
                        onPress={prevStep}
                        className="rounded-xl bg-gray-100 text-gray-700"
                      >
                        Back
                      </Button>
                    </m.div>
                  )}
                </div>

                <div className="flex gap-3">
                  <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="button"
                      variant="flat"
                      startContent={<FiX />}
                      onPress={() => router.back()}
                      className="rounded-xl bg-gray-100 text-gray-700"
                    >
                      Cancel
                    </Button>
                  </m.div>

                  {currentStep < 3 ? (
                    <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="button"
                        onPress={nextStep}
                        isDisabled={!canProceed()}
                        endContent={<FiArrowRight />}
                        className="rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg shadow-primary/25"
                      >
                        Continue
                      </Button>
                    </m.div>
                  ) : (
                    <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        isLoading={loading}
                        isDisabled={!canProceed()}
                        startContent={!loading && <FiSend />}
                        className="rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg shadow-primary/25 px-8"
                      >
                        {loading ? 'Creating...' : 'Create Campaign'}
                      </Button>
                    </m.div>
                  )}
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      </m.div>
    </div>
  );
}
