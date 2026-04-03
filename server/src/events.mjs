export function createEventBus() {
  const events = [];
  return {
    publish(type, payload) {
      const event = { type, payload, timestamp: new Date().toISOString() };
      events.push(event);
      return event;
    },
    list() {
      return [...events];
    },
  };
}
