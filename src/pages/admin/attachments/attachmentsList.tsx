import React from "react";
import type{ Attachment } from "../../../types/attachments.ts";
import { getAttachmentDownloadUrl } from "../../../api/attachments.ts";
import { deleteAttachment } from "../../../api/attachments.ts";

interface Props {
    attachments: Attachment[];
    onDelete: () => void;
}

const isPreviewable = (mime?: string) =>
    mime?.startsWith("image/") || mime === "application/pdf";

const AttachmentList: React.FC<Props> = ({ attachments, onDelete}) => {
    return (
        <ul className="attachments-list">
            {attachments.map((att) => (
                <li key={att.id}>
                    <div>
                        <strong>{att.file_name}</strong>({att.size} байт)
                    </div>
                    <div>
                        {isPreviewable(att.mime_type) ? (
                            att.mime_type?.startsWith("image/") ? (
                                <img 
                                    src={getAttachmentDownloadUrl(att.id)} 
                                    alt={att.file_name} 
                                />
                            ) : (
                                <a
                                    href={getAttachmentDownloadUrl(att.id)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Открыть PDF
                                </a>
                            )
                        ) : (
                            <span>Нет предпросмотра</span>
                        )}
                    </div>
                        <a href={getAttachmentDownloadUrl(att.id)}
                        download={att.file_name}
                    >
                        Скачать
                    </a>
                    <button className="delete-btn"
                    onClick={async () => {
                        if (window.confirm(`Удалить файл: '${att.file_name}'?`)) {
                            try {
                                await deleteAttachment(att.id);
                                onDelete();
                            } catch (error) {
                                console.error('Ошибка удаления файла')
                            }
                        }
                    }}
                    >
                        Удалить
                    </button>            
                </li>
            ))}
        </ul>   
    );  
};

export default AttachmentList;