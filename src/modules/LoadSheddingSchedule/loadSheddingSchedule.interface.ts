export interface ICreateLoadSheddingSchedule {
  areaId: string;
  startTime: string;
  endTime: string;
  reason?: string;
  description?: string;
}

export interface IUpdateLoadSheddingSchedule {
  areaId?: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
  description?: string;
}