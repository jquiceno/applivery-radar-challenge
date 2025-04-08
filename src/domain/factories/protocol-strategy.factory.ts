import { ProtocolStrategy } from '../interfaces';
import { ProtocolType } from '../enums';
import { ClosestEnemiesProtocol, FurthestEnemiesProtocol } from '../strategies/protocols';
import { AvoidMechProtocol, PrioritizeMechProtocol } from '../strategies/protocols';
import { AssistAlliesProtocol, AvoidCrossfireProtocol } from '../strategies/protocols';

export class ProtocolStrategyFactory {
  strategies: Record<ProtocolType, new () => ProtocolStrategy> = {
    [ProtocolType.CLOSEST_ENEMIES]: ClosestEnemiesProtocol,
    [ProtocolType.FURTHEST_ENEMIES]: FurthestEnemiesProtocol,
    [ProtocolType.AVOID_MECH]: AvoidMechProtocol,
    [ProtocolType.PRIORITIZE_MECH]: PrioritizeMechProtocol,
    [ProtocolType.ASSIST_ALLIES]: AssistAlliesProtocol,
    [ProtocolType.AVOID_CROSSFIRE]: AvoidCrossfireProtocol,
  };
  get(type: ProtocolType): ProtocolStrategy {
    const Strategy = this.strategies[type];
    if (!Strategy) throw new Error(`Unknown protocol: ${type}`);
    return new Strategy();
  }
}
