import React, { useRef, useState } from "react";
import { uploadAttachment } from "../../../api/attachments";

interface Props {
    onUpload: () => void;
}

const FileUpload: React.FC<Props> = ({ onUpload }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files || e.target.files.length === 0) return;
        setUploading(true);
        setError(null);
        try {
            await uploadAttachment(e.target.files[0]);
            onUpload();
            if(fileInputRef.current) fileInputRef.current.value = '';
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка загрузки');
        } finally {
            setUploading(false)
        }
    };

    return (
        <div>
            <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={uploading}
                accept="*/*"
            />
            {uploading && <span>Загрузка...</span>}
            {error && <span>{error}</span>}
        </div>
    );
};

export default FileUpload;