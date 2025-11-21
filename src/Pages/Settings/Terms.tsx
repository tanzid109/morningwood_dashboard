"use client"
import { useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';

// Dynamic import with ssr: false to prevent server-side rendering issues
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const TermsEditor = () => {
  const editor = useRef(null);
  const [content, setContent] = useState(`
    <h2><strong>Effective Date: 1st September 2025</strong></h2>
    <p>Welcome to morningwood by using our website or app, you agree to these terms.</p>
    
    <p><strong>1. Using Our Service</strong><br>
    You must be at least 13 years old to use the platform.You agree not to share illegal, hateful, or copyrighted content.</p>
    
    <p><strong>2. Account Responsibilities</strong><br>
    Keep your login credentials secure.You are responsible for any activity done through your account.</p>

    <p><strong>3. Content Ownership</strong><br>
    Creators retain ownership of their content, but grant us permission to display it on the platform.</p>
    
    <p><strong>4. Payments & Subscriptions</strong><br>
    If applicable, subscriptions or tips are processed securely through our payment partners.</p>
    <p><strong>5. Termination</strong><br>
    We reserve the right to suspend or remove accounts that violate our community guidelines.</p>
    <p><strong>6. Limitation of Liability</strong><br>
    We are not liable for losses or damages caused by user content, downtime, or unauthorized access.</p>
    <p><strong>7. Changes to Terms</strong><br>
    We may update these terms at any time. Continued use of the platform means you accept the updated terms.</p>
  `);

  const config = useMemo(
    () =>
    ({
      readonly: false,
      placeholder: 'Start typing...',
      height: 500,
      theme: 'dark',
      style: {
        background: '#2a2320',
        color: '#FDD3C6',
      },
      toolbarAdaptive: false,
      toolbar: true,
      buttons: [
        'font',
        'fontsize',
        '|',
        'bold',
        'italic',
        'underline',
        '|',
        'ul',
        'ol',
        '|',
        'align',
        '|',
        'undo',
        'redo',
      ],
      controls: {
        font: {
          list: {
            Sora: 'Sora',
            Inter: 'Inter',
            Arial: 'Arial',
            Georgia: 'Georgia',
            'Times New Roman': 'Times New Roman',
          },
        },
        fontsize: {
          list: '12,14,16,18,20,24,28,32',
        },
      },

      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,

      // ✅ Stop error
      defaultActionOnPaste: 'clear',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any),
    []
  );



  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    return date.toLocaleString('en-GB', options).replace(',', ' at');
  };

  const handleSave = () => {
    console.log('Saving privacy policy:', content);
    alert('Privacy Policy saved successfully!');
  };

  const lastUpdated = formatDate(new Date('2025-08-25T15:25:00'));

  return (
    <div className="text-[#FDD3C6]">
      <style>{`
  .jodit-container {
    background: #24120C !important;
    color: #FDD3C6 !important;
    border: 1px solid #5A392F !important;
    border-radius: 8px !important;
    font-family: 'Sora', sans-serif !important;
  }
  
  .jodit-toolbar-editor-collection {
    background: #24120C !important;
    border-bottom: 1px solid #3a3330 !important;
  }
  
  .jodit-toolbar__box {
    background: #2a2320 !important;
  }
  
  .jodit-toolbar-button {
    background: transparent !important;
    color: #FDD3C6 !important;
  }
  
  .jodit-toolbar-button:hover {
    background: #3a3330 !important;
  }
  
  .jodit-toolbar-button_active {
    background: #3a3330 !important;
  }
  
  .jodit-toolbar-button__icon svg {
    fill: #FDD3C6 !important;
  }
  
  .jodit-wysiwyg {
    background: #24120C !important;
    color: #FDD3C6 !important;
    padding: 24px !important;
    font-size: 16px !important;
    line-height: 1.6 !important;
  }
  
  .jodit-wysiwyg p {
    color: #FDD3C6 !important;
    margin-bottom: 12px !important;
  }
  
  .jodit-wysiwyg ul,
  .jodit-wysiwyg ol {
    color: #FDD3C6 !important;
    margin-left: 20px !important;
    margin-bottom: 12px !important;
  }
  
  .jodit-wysiwyg li {
    color: #FDD3C6 !important;
    margin-bottom: 4px !important;
  }
  
  .jodit-wysiwyg h2 {
    color: #FDD3C6 !important;
    font-size: 20px !important;
    margin-bottom: 16px !important;
  }
  
  .jodit-status-bar {
    background: #2a2320 !important;
    border-top: 1px solid #3a3330 !important;
    color: #FDD3C6 !important;
  }
  
  .jodit-ui-select__value {
    background: #1a1512 !important;
    color: #FDD3C6 !important;
    border-color: #3a3330 !important;
  }
  
  .jodit-ui-select__options {
    background: #2a2320 !important;
    border-color: #3a3330 !important;
  }
  
  .jodit-ui-select__option {
    color: #FDD3C6 !important;
  }
  
  .jodit-ui-select__option:hover {
    background: #3a3330 !important;
  }
  
  .jodit-placeholder {
    color: #FDD3C6 !important;
  }
`}</style>


      <div className="text-[#FDD3C6] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <p className="text-base text-[#FDD3C6]">Last Updated on {lastUpdated}</p>
        </div>

        {/* Jodit Editor */}
        <div className="rounded-lg overflow-hidden">
          <JoditEditor
            ref={editor}
            value={content}
            config={config}
            onBlur={newContent => setContent(newContent)}
            onChange={newContent => { }}
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleSave}
            className="bg-[#8b4513] hover:bg-[#a0522d] text-white px-12 py-2 rounded-md"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TermsEditor;