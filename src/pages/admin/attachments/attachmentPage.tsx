import React, {useState, useEffect} from "react";
import FileUpload from "./attachmentUpload.tsx";
import AttachmentList from "./attachmentsList.tsx";
import type { Attachment } from "../../../types/attachments.ts";
import { fetchAttachments } from "../../../api/attachments.ts";
import "../../../styles/attachments.css"

const AttachmentsPage: React.FC = () => {
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadAttachments = async() => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchAttachments();
            setAttachments(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка загрузки списка файлов');
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        loadAttachments();
    }, []);

    return (
        <div className="attachments-container">
            <h2>Дополнительные файлы</h2>
            <div className="file-upload">
                <FileUpload onUpload={loadAttachments} />
            </div>
            {loading && <p>Загрузка файлов...</p>}
            {error && <p>{error}</p>}
            {!loading && <AttachmentList attachments={attachments} />}
        </div>
    );
};
export default AttachmentsPage;