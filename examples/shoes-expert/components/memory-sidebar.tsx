import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner';

export function MemorySidebar() {
    const [memoryName, setMemoryName] = useState('');
    const [memoryDescription, setMemoryDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateMemory = async () => {
    try {
      const response = await fetch('/api/chat?action=createMemory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: memoryName, description: memoryDescription })
      });
      if (!response.ok) throw new Error('Failed to create memory');
      const data = await response.json();
      toast.success('Memory created successfully');
      console.log('Memory created:', data);
    } catch (error) {
      toast.error('Error creating memory');
      console.error('Error creating memory:', error);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('fileName', file, file.name);
      formData.append('memoryName', memoryName);

      const response = await fetch('/api/chat?action=uploadFile', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', response.status, errorText);
        throw new Error(`Failed to upload file: ${response.status} ${errorText}`);
      }

      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error('Error uploading file');
      console.error('Error uploading file:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : '');
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col space-y-2">
      <h2 className="text-lg font-semibold">Attach Memory</h2>
      <p className="text-sm text-muted-foreground">
        Manage your memory and upload files.
      </p>
      <label htmlFor="memoryName">Memory Name</label>
      <input
        id="memoryName"
        type="text"
        placeholder="Enter memory name"
        value={memoryName}
        onChange={(e) => setMemoryName(e.target.value)}
        className="w-full px-2 py-1 text-sm border rounded  bg-slate-900"
      />
      <label htmlFor="memoryDescription">Memory Description</label>
      <input
        id="memoryDescription"
        type="text"
        placeholder="Enter memory description"
        value={memoryDescription}
        onChange={(e) => setMemoryDescription(e.target.value)}
        className="w-full px-2 py-1 text-sm border rounded bg-slate-900"
      />
      <Button onClick={handleCreateMemory} variant="outline-background">
        Create Memory
      </Button>
      <label htmlFor="selectedFile">Selected File</label>
      <input
        id="selectedFile"
        type="text"
        placeholder="No file selected"
        value={fileName}
        readOnly
        className="w-full px-2 py-1 text-sm border rounded bg-slate-900"
      />
      <input
        id="fileInput"
        ref={fileInputRef}
        type="file"
        readOnly
        onChange={handleFileChange}
        aria-label="Select file to upload"
        style={{ display: 'none' }}
        title="Choose a file to upload"
      />
      <Button onClick={handleFileSelect} variant="destructive-hover" aria-label="Select file" title="Click to select a file">
        Select File
      </Button>
      <Button onClick={handleFileUpload} variant="outline-background">
        Upload File to Memory
      </Button>
    </div>
  );
}