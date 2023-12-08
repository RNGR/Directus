import type { Bus, MessageHandler } from '../types/class.js';
import type { BusConfigLocal } from '../types/config.js';

export class BusLocal implements Bus {
	private handlers: Record<string, Set<MessageHandler>>;

	constructor(_config: Omit<BusConfigLocal, 'type'>) {
		this.handlers = {};
	}

	async publish<T = unknown>(channel: string, payload: T) {
		this.handlers[channel]?.forEach((callback) => {
			try {
				callback(payload);
			} catch {
				// Do nothing..
				// This might feel a little odd, but it's consistent with the redis based
				// pub/sub and event listeners in general. You don't expect the event to crash if the
				// handler has an error.
			}
		});
	}

	async subscribe(channel: string, callback: MessageHandler) {
		const set = this.handlers[channel] ?? new Set();

		set.add(callback);

		this.handlers[channel] = set;
	}

	async unsubscribe(channel: string, callback: MessageHandler) {
		this.handlers[channel]?.delete(callback);
	}
}
