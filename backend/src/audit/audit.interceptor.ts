import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../prisma/prisma.service'; // Adjust path if needed

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { user, method, url, body } = request;

    // We only want to audit mutations
    if (method === 'GET' || !user) {
      return next.handle();
    }

    const action = `${method}_${url.replace(/\//g, '_').toUpperCase()}`;

    return next.handle().pipe(
      tap(async (data) => {
        try {
          await this.prisma.auditLog.create({
            data: {
              action,
              details: {
                requestBody: body,
                responseData: data,
              },
              userId: user.id,
              companyId: user.companyId,
            },
          });
        } catch (error) {
          // Handle or log the audit failure
          console.error('Failed to create audit log:', error);
        }
      }),
    );
  }
}
