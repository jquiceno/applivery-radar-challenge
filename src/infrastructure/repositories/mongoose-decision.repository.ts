import { TargetDecision } from '@domain/entities';
import { TargetDecisionRepository } from '@domain/interfaces/decision-repository.interface';
import { DecisionModel } from '../schemas/decision.schema';
import { ProtocolType } from '@domain/enums/protocol-type.enum';
import { ScanPoint } from '@domain/value-objects/scan-point.vo';
import { Coordinates } from '@domain/value-objects/coordinates.vo';
import { Enemy } from '@domain/value-objects/enemy.vo';

export class MongooseDecisionRepository implements TargetDecisionRepository {
  async create(decision: TargetDecision): Promise<string> {
    const createdDecision = await DecisionModel.create({
      protocols: decision.protocols,
      scan: decision.scan.map((point) => ({
        coordinates: point.coordinates,
        enemies: point.enemies,
        allies: point.allies,
      })),
      target: decision.target,
      id: decision.id,
    });

    return createdDecision._id.toString();
  }

  async findAll(): Promise<TargetDecision[]> {
    const decisions = await DecisionModel.find().lean();
    return decisions.map((doc) => this.mapToEntity(doc));
  }

  async findById(id: string): Promise<TargetDecision | null> {
    const doc = await DecisionModel.findOne({ id }).lean();
    if (!doc) return null;
    return this.mapToEntity(doc);
  }

  async delete(id: string): Promise<string> {
    await DecisionModel.deleteOne({ id });
    return id;
  }

  private mapToEntity(doc: any): TargetDecision {
    const scanPoints = doc.scan.map(
      (point: any) =>
        new ScanPoint(
          new Coordinates(point.coordinates.x, point.coordinates.y),
          point.enemies.map((enemy: any) => new Enemy(enemy.type, enemy.number)),
          point.allies,
        ),
    );

    return new TargetDecision(
      doc.protocols as ProtocolType[],
      scanPoints,
      new Coordinates(doc.target.x, doc.target.y),
      doc.id,
      doc.createdAt,
    );
  }
}
