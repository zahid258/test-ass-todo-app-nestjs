import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ActivityLog, ActivityLogSchema } from "src/entities";
import { HttpExceptionFilter } from "src/middlewares/exception-handler";

@Module({
    imports: [],
    providers: [HttpExceptionFilter],
    exports: [HttpExceptionFilter],
})
export class LoggerModule { }