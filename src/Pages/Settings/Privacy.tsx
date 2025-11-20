"use client"
import React, { useState, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';
import { Button } from '@/components/ui/button';

const PrivacyPolicyEditor: React.FC = () => {
    const editor = useRef(null);
    const [content, setContent] = useState(`
    <h2><strong>Effective Date: 1st September 2025</strong></h2>
    <p>morningwood.com, Our values your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our Web application and related services.</p>
    
    <p><strong>1. Information We Collect</strong><br>
    We may collect details like your name, email, username, and usage activity when you create an account, stream content, or interact with other users.</p>
    
    <p><strong>2. How We Use Your Information</strong><br>
    Your information is used to:</p>
    <ul>
      <li>Personalize your experience</li>
      <li>Improve platform performance</li>
      <li>Send important updates or security alerts</li>
      <li>Prevent fraud or misuse</li>
    </ul>
    
    <p><strong>3. Data Sharing</strong><br>
    We don't sell your data. Limited information may be shared only with trusted service providers to operate the platform securely.</p>
    
    <p><strong>4 Your Choices</strong><br>
    You can edit or delete your profile, adjust notification preferences, and manage your privacy settings anytime.</p>
  `);

    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: 'Start typing...',
            height: 500,
            theme: 'dark',
            style: {
                background: '#2a2320',
                color: '#ffffff',
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
            buttonsMD: [
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
            ],
            buttonsSM: [
                'bold',
                'italic',
                '|',
                'ul',
                'ol',
                '|',
                'align',
            ],
            buttonsXS: [
                'bold',
                'italic',
                '|',
                'ul',
                'ol',
            ],
            controls: {
                font: {
                    list: {
                        'Sora': 'Sora',
                        'Inter': 'Inter',
                        'Arial': 'Arial',
                        'Georgia': 'Georgia',
                        'Times New Roman': 'Times New Roman',
                    }
                },
                fontsize: {
                    list: '12,14,16,18,20,24,28,32'
                }
            },
            askBeforePasteHTML: false,
            askBeforePasteFromWord: false,
            defaultActionOnPaste: 'insert_clear_html',
        }),
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
        <div className="min-h-screen bg-[#1a1512] text-white p-6">
            <style>{`
        .jodit-container {
          background: #2a2320 !important;
          border: 1px solid #3a3330 !important;
          border-radius: 8px !important;
          font-family: 'Sora', sans-serif !important;
        }
        
        .jodit-toolbar-editor-collection {
          background: #2a2320 !important;
          border-bottom: 1px solid #3a3330 !important;
        }
        
        .jodit-toolbar__box {
          background: #2a2320 !important;
        }
        
        .jodit-toolbar-button {
          background: transparent !important;
          color: #ffffff !important;
        }
        
        .jodit-toolbar-button:hover {
          background: #3a3330 !important;
        }
        
        .jodit-toolbar-button_active {
          background: #3a3330 !important;
        }
        
        .jodit-wysiwyg {
          background: #2a2320 !important;
          color: #ffffff !important;
          padding: 24px !important;
          font-size: 16px !important;
          line-height: 1.6 !important;
        }
        
        .jodit-wysiwyg p {
          color: #ffffff !important;
          margin-bottom: 12px !important;
        }
        
        .jodit-wysiwyg ul,
        .jodit-wysiwyg ol {
          color: #ffffff !important;
          margin-left: 20px !important;
          margin-bottom: 12px !important;
        }
        
        .jodit-wysiwyg li {
          color: #ffffff !important;
          margin-bottom: 4px !important;
        }
        
        .jodit-wysiwyg h2 {
          color: #ffffff !important;
          font-size: 20px !important;
          margin-bottom: 16px !important;
        }
        
        .jodit-status-bar {
          background: #2a2320 !important;
          border-top: 1px solid #3a3330 !important;
          color: #ffffff !important;
        }
        
        .jodit-ui-select__value {
          background: #1a1512 !important;
          color: #ffffff !important;
          border-color: #3a3330 !important;
        }
        
        .jodit-ui-select__options {
          background: #2a2320 !important;
          border-color: #3a3330 !important;
        }
        
        .jodit-ui-select__option {
          color: #ffffff !important;
        }
        
        .jodit-ui-select__option:hover {
          background: #3a3330 !important;
        }
        
        .jodit-toolbar-button__icon svg {
          fill: #ffffff !important;
        }
        
        .jodit-placeholder {
          color: #666 !important;
        }
      `}</style>

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <p className="text-sm text-gray-400">Last Updated on {lastUpdated}</p>
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

export default PrivacyPolicyEditor;