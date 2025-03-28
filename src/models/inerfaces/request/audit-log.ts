export interface IAuditLogRequest {
    action: 'added' | 'modified' | 'deleted';
    model: string;
    oldState?: string;
    newState?: string;
    accountId?: string;
    message: string;
    entityId: string;
    changedFields?: Array<string>
}