export interface MusicType {
  id: number;
  spotify_id: string;
  artist_id: number;
  category_id: number;
  title: string;
  album_name: string;
  album_image: string;
  duration_ms: number;
  preview_url: string;
  release_date: Date;
  createdAt: Date;
}
