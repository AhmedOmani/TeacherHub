export type BlockType = 'youtube' | 'link' | 'google-form' | 'canva' | 'video';

export interface Block {
  id: string;
  type: BlockType;
  title: string;
  url: string;
  emoji?: string;
  borderColor?: string;
}

export interface Section {
  id: string;
  title: string;
  badgeName?: string;
  badgeColor?: string;
  blocks: Block[];
}

export interface ConfigObj {
  hero: {
    title: string;
    subtitle: string;
    avatar: string;
    avatarPosition?: string;
  };
  appearance?: {
    backgroundUrl?: string;
    showGradientOrbs?: boolean;
  };
  sections: Section[];
}

export const defaultConfig: ConfigObj = {
  hero: {
    title: 'أستاذ أحمد',
    subtitle: 'مرحباً بكم في منصة التعليم الخاصة بي',
    avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  },
  sections: [
    {
      id: 'sec-1',
      title: 'الوحدة الأولى: التفاضل والتكامل',
      blocks: [
        {
          id: 'blk-1',
          type: 'youtube',
          title: 'مقدمة في التفاضل',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        },
        {
          id: 'blk-2',
          type: 'link',
          title: 'ملخص القوانين (PDF)',
          url: '#',
        },
      ],
    },
  ],
};
