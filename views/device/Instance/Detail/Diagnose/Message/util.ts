export type MessageType = {
    up: {
      text: string;
      status: 'loading' | 'success' | 'error';
    };
    down: {
      text: string;
      status: 'loading' | 'success' | 'error';
    };
}

export const messageStyleMap = new Map();
messageStyleMap.set('loading', {
  background: 'linear-gradient(0deg, rgba(30, 165, 241, 0.03), rgba(30, 165, 241, 0.03)), #FFFFFF',
  boxShadow: '-2px 0px 0px #1EA5F1',
});
messageStyleMap.set('error', {
  background: 'linear-gradient(0deg, rgba(255, 77, 79, 0.03), rgba(255, 77, 79, 0.03)), #FFFFFF',
  boxShadow: '-2px 0px 0px #FF4D4F',
});
messageStyleMap.set('success', {
  background: 'linear-gradient(0deg, rgba(50, 212, 164, 0.03), rgba(50, 212, 164, 0.03)), #FFFFFF',
  boxShadow: '-2px 0px 0px #32D4A4',
});

export const messageStatusMap = new Map();
messageStatusMap.set('loading', 'processing');
messageStatusMap.set('error', 'error');
messageStatusMap.set('success', 'success');