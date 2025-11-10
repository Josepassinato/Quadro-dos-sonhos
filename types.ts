
export interface Item {
  id: string;
  imageUrl: string;
  caption: string;
}

export interface Section {
  id: string;
  name: string;
  items: Item[];
}

export interface Board {
  id: string;
  title: string;
  isPublic: boolean;
  shareSlug: string;
  sections: Section[];
  themeId?: string;
}

export interface ReminderSettings {
    email: string;
    active: boolean;
}

export interface User {
  email: string;
}
