import { randomUUID } from "crypto";
import { IActivityLogResponse, ITokenUser } from "../models";
import { logDetailGenerator } from "../utility/log-detail-generator";
import { requestPlatformExtract, tryParse } from "../utility";
import { EmptyGuid } from "../constants";
import { Request } from "express";
import { model, Schema, Types } from "mongoose";
import { ObjectId } from "typeorm";

export class ActivityLog {
    _id!: Types.ObjectId;
    createdAt!: Date;
    active!: boolean;
    createdBy!: string;
    createdById!: string;
    modifiedAt?: Date;
    modifiedBy?: string;
    modifiedById?: string;
    deleted!: boolean; 
    logDetail!: string;
    url!: string;
    model!: string;
    method!: 'get' | 'put' | 'delete' | 'post' | string;
    status!: 'success' | 'error';
    platform?: string;
    language?: string;
    ipAddress?: string;
    params?: string;
    queryParams?: string; 
    body?: string;
    headers?: string; 
    errorDetail?: string;
    accountId?: string;

    
    logStart(url: string, method: 'get' | 'put' | 'delete' | 'post' | string, request: Request, contextUser?: ITokenUser): ActivityLog {
        this._id =  new Types.ObjectId();
        this.createdAt = new Date();

        if(contextUser){
            this.createdById = contextUser.id;
            this.createdBy = contextUser.name;
        }

        this.url = url;
        let {model, detail} = logDetailGenerator(url, method);
        this.logDetail = detail;
        this.model = model;
        this.ipAddress = request.headers['x-forwarded-for'] ? request.headers['x-forwarded-for'].toString() : request.ip?.toString() ?? '';
        this.platform = requestPlatformExtract(request.headers['user-agent']);
        
        this.method = method;
        this.body = request.body ? JSON.stringify(request.body) : undefined;
        this.params = request.params && Object.keys(request.params).length ? JSON.stringify(request.params) : undefined; 
        this.queryParams = request.query && Object.keys(request.query).length ? JSON.stringify(request.query) : undefined;
        this.headers = request.headers ? JSON.stringify(request.headers) : undefined;
        return this
    }

    addUserDetails(contextUser: ITokenUser){
        this.createdBy = contextUser.name;
        this.createdById = contextUser.id;
        this.accountId = contextUser.accountId;
        return this
    }

    async logEnd(status: 'success' | 'error', errorDetail?: string): Promise<ActivityLog> {
        this.status = status;
        this.errorDetail = errorDetail;
        
        if(!this.createdById || !this.accountId){
            this.createdBy = 'System';
            this.createdById = EmptyGuid;
        }
        try{

            return await ActivityLogModel.insertOne(this);
        }catch(e){
            return new ActivityLog
        }
    }

    toResponse(entity?: ActivityLog): IActivityLogResponse {

        if(!entity) entity = this;

        return {
            id: entity._id.toString(),
            active: entity.active,
            createdAt: entity.createdAt,
            createdBy: entity.createdBy,
            createdById: entity.createdById,
            modifiedAt: entity.modifiedAt,
            modifiedBy: entity.modifiedBy,
            modifiedById: entity.modifiedById,
            logDetail: entity.logDetail,
            url: entity.url,
            model: entity.model,
            method: entity.method,
            status: entity.status,
            platform: entity.platform,
            language: entity.language,
            ipAddress: entity.ipAddress,
            params: entity.params ? JSON.parse(entity.params) : undefined,
            queryParams: entity.queryParams ? JSON.parse(entity.queryParams) : undefined,
            body: entity.body ? tryParse(entity.body) : undefined, 
            headers: entity.headers ? tryParse(entity.headers) : undefined,
            errorDetail: entity.errorDetail
        }
    }

}

export const ActivityLogSchema = new Schema<ActivityLog>({
    _id: { type: Schema.Types.ObjectId, required: true },
    createdAt: { type: Date, required: true },
    active: { type: Boolean, required: true, default: true },
    createdBy: { type: String, required: true },
    createdById: { type: String, required: true },
    modifiedAt: { type: Date, default: null },
    modifiedBy: { type: String, default: null },
    modifiedById: { type: String, default: null },
    deleted: { type: Boolean, required: true, default: false },
    logDetail: { type: String, required: true },
    url: { type: String, required: true }, 
    model: { type: String, required: true },
    method: { type: String, required: true },
    status: { type: String, required: true, enum: ['success', 'error'] },
    platform: { type: String },
    language: { type: String },
    ipAddress: { type: String },
    params: { type: String },
    queryParams: { type: String },
    body: { type: String },
    headers: { type: String },
    errorDetail: { type: String },
    accountId: { type: String }
  }, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });
  ActivityLogSchema.loadClass(ActivityLog);
  const ActivityLogModel = model<ActivityLog>('ActivityLog', ActivityLogSchema);