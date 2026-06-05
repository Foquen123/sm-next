import { PatternRead } from './pattern';
import { SubjectRead } from './subject';

export interface TeacherRead {
  id: number;
  subjects: SubjectRead[];
  firstName: string;
  lastName: string;
  patronymic: string;
  color: string;
  patternColor: string;
  pattern: PatternRead;
}

export interface TeacherUpdate {
  first_name: string;
  last_name: string;
  patronymic: string;
  color: string;
  pattern_color: string;
  pattern_id: number;
  subjects_ids: number[];
}
export interface TeacherCreate {
  first_name: string;
  last_name: string;
  patronymic: string;
  color: string;
  pattern_color: string;
  pattern_id: number;
  subjects_ids: number[];
}

export interface TeacherDelete {
  id: number;
}
