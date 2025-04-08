import {
  ScanPoint,
  Enemy,
  ProtocolStrategyFactory,
  Coordinates,
  ProtocolType,
  TargetDecision,
  TargetDecisionRepository,
} from '@src/domain';

import { DecideTargetDto } from '../dtos';

export class DecideTargetUseCase {
  private readonly avoidProtocols = [ProtocolType.AVOID_MECH, ProtocolType.AVOID_CROSSFIRE];

  constructor(
    private readonly protocolStrategyFactory: ProtocolStrategyFactory,
    private readonly targetDecisionRepository: TargetDecisionRepository,
  ) {}

  async execute(input: DecideTargetDto): Promise<TargetDecision> {
    const { scan } = input;

    const scanPoints = scan.map((point) => {
      const coordinates = new Coordinates(point.coordinates.x, point.coordinates.y);
      const enemies = new Enemy(point.enemies.type, point.enemies.number);
      const scan = new ScanPoint(coordinates, enemies, point.allies);
      return scan;
    });

    let filtered: ScanPoint[] = scanPoints.filter((point) => point.valid);

    if (!scanPoints.length) {
      throw new Error('No scan points provided.');
    }

    const avoidProtocols = input.protocols.filter((protocol) =>
      this.avoidProtocols.includes(protocol),
    );

    if (avoidProtocols) {
      input.protocols = [
        ...avoidProtocols,
        ...input.protocols.filter((protocol) => !this.avoidProtocols.includes(protocol)),
      ];
    }

    for (const protocolName of input.protocols) {
      const strategy = this.protocolStrategyFactory.get(protocolName);
      filtered = strategy.apply(filtered);
    }

    if (!filtered.length) {
      throw new Error('No target found after applying protocols.');
    }

    const [target] = filtered;

    const decision = new TargetDecision(input.protocols, scanPoints, target.coordinates);

    await this.targetDecisionRepository.create(decision);

    return decision;
  }
}
