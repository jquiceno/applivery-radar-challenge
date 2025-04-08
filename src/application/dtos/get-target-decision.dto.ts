import { IsUUID } from 'class-validator';

export class GetTargetDecisionDto {
  @IsUUID()
  id: string;
}
