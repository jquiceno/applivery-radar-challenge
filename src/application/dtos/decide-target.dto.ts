import { IsArray, IsEnum, IsNumber, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EnemyType, ProtocolType } from '@domain/enums';

export class CoordinatesDto {
  @IsNumber()
  x: number;

  @IsNumber()
  y: number;
}

export class EnemyDto {
  @IsEnum(EnemyType)
  type: EnemyType;

  @IsNumber()
  number: number;
}

export class ScanPointDto {
  @IsObject()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates: CoordinatesDto;

  @ValidateNested()
  @Type(() => EnemyDto)
  enemies: EnemyDto;

  @IsNumber()
  @IsOptional()
  allies: number;

  valid: boolean;
}

export class DecideTargetDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScanPointDto)
  scan: ScanPointDto[];

  @IsEnum(ProtocolType, { each: true })
  protocols: ProtocolType[];
}
