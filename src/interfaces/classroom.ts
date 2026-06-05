export interface ClassroomRead {
  id: number;
  name: string;
  isAllowConflicts: boolean;
}

export interface ClassroomCreate {
  name: string;
  isAllowConflicts: boolean;
}

export interface ClassroomUpdate {
  isAllowConflicts: boolean;
}

export interface ClassroomDelete {
  id: number;
}
