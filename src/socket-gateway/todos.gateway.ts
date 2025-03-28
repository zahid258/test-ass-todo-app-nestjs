import { 
    WebSocketGateway, 
    WebSocketServer, 
    OnGatewayInit, 
    OnGatewayConnection, 
    OnGatewayDisconnect 
  } from '@nestjs/websockets';
  import { Logger } from '@nestjs/common';
  import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
  
  @WebSocketGateway({
    cors: {
      origin: '*', // In production, set this to your frontend URL
    },
    namespace: 'todos',
    // Enable authentication middleware
    middlewares: [],
  })
  export class TodosGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('TodosGateway');
    // Track active connections
    private activeConnections: Map<string, { userId: string, client: Socket }> = new Map();
    
    constructor(private jwtService: JwtService) {}
  
    afterInit(server: Server) {
      this.logger.log('WebSocket Gateway initialized');
    }
  
    async handleConnection(client: Socket, ...args: any[]) {
      try {
        // Get the auth token from the handshake
        const token = client.handshake.auth.token || 
                     client.handshake.headers.authorization?.split(' ')[1];
        
        if (!token) {
          this.logger.error(`No token provided: ${client.id}`);
          client.disconnect();
          return;
        }
        
        // Verify and decode token
        const decoded = await this.jwtService.verify(token,{   
            secret: process.env.JWT_SECRET,
            ignoreExpiration: false
        });
        const userId = decoded.id;
        
        // Store user connection information
        this.activeConnections.set(client.id, { 
          userId, 
          client 
        });
        
        // Join user to their own room for targeted events
        client.join(`user:${userId}`);
        
        this.logger.log(`Client connected: ${client.id}, User: ${userId}`);
      } catch (error) {
        this.logger.error(`Authentication failed for client ${client.id}:`, error.message);
        client.disconnect();
      }
    }
  
    handleDisconnect(client: Socket) {
      // Remove from active connections
      this.activeConnections.delete(client.id);
      this.logger.log(`Client disconnected: ${client.id}`);
    }
    
    // Get all connected clients for a user
    getUserSockets(userId: string): Socket[] {
      const userSockets: Socket[] = [];
      this.activeConnections.forEach((connection, clientId) => {
        if (connection.userId === userId) {
          userSockets.push(connection.client);
        }
      });
      return userSockets;
    }
  
    // Methods to emit todo events
    
    // Broadcast to everyone
    emitTodoCreated(todo: any, ownerId: string) {
      // Broadcast to all
      this.server.emit('todo.created', todo);
      
      // Send specific event to the owner
      this.server.to(`user:${ownerId}`).emit('todo.created.mine', todo);
    }
  
    emitTodoUpdated(todo: any, ownerId: string, updaterId: string) {
      // Broadcast to all
      this.server.emit('todo.updated', todo);
      
      // Additional specific events
      if (ownerId !== updaterId) {
        // Notify owner specifically
        this.server.to(`user:${ownerId}`).emit('todo.updated.byOthers', {
          todo,
          updatedBy: updaterId
        });
      }
    }
  
    emitTodoDeleted(todoId: string, ownerId: string, deleterId: string) {
      // Broadcast to all
      this.server.emit('todo.deleted', todoId);
      
      // Notify owner specifically if different from deleter
      if (ownerId !== deleterId) {
        this.server.to(`user:${ownerId}`).emit('todo.deleted.byOthers', {
          todoId,
          deletedBy: deleterId
        });
      }
    }
    
    // Send event only to specific user
    emitToUser(userId: string, event: string, data: any) {
      this.server.to(`user:${userId}`).emit(event, data);
    }
  }