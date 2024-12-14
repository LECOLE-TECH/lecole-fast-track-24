interface SnowflakeOptions {
	epoch?: number;
	nodeId?: number;
	sequence?: number;
}

class SnowflakeIdGenerator {
	private epoch: number;
	private nodeId: number;
	private sequence: number = 0;
	private lastTimestamp: number = -1;

	constructor(options: SnowflakeOptions = {}) {
		// Default epoch to Jan 1, 2024
		this.epoch = options.epoch || 1704067200000;
		// Default node ID to a random number between 0-1023
		this.nodeId = options.nodeId || Math.floor(Math.random() * 1024);
	}

	generate(): bigint {
		let timestamp = Date.now();

		// Ensure monotonic increasing
		if (timestamp < this.lastTimestamp) {
			throw new Error("Clock moved backwards");
		}

		if (timestamp === this.lastTimestamp) {
			this.sequence = (this.sequence + 1) & 4095; // 12-bit sequence
			if (this.sequence === 0) {
				// Sequence overflow, wait for next millisecond
				while (timestamp <= this.lastTimestamp) {
					timestamp = Date.now();
				}
			}
		} else {
			this.sequence = 0;
		}

		this.lastTimestamp = timestamp;

		// Construct Snowflake ID
		const snowflakeId =
			(BigInt(timestamp - this.epoch) << 22n) |
			(BigInt(this.nodeId) << 12n) |
			BigInt(this.sequence);

		return snowflakeId;
	}
}

export const snowflakeIdGenerator = new SnowflakeIdGenerator();
