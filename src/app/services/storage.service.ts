import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cell } from 'src/app/models/Cell';
import { File } from 'src/app/models/File';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private http:HttpClient) { }

  getCell(cellID:string)
  {
    return this.http.get<Cell>(`https://localhost:7091/cells/${cellID}`)
  }

  uploadFile(file:globalThis.File)
  {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post<{path:string}>(`https://localhost:7091/files/upload`, formData);
  }
  registerFile(file:globalThis.File, filePath:string)
  {
    return this.http.post<File>(`https://localhost:7091/files`, {name:file.name, type:file.type, size:file.size.toString(), path:filePath.split('/')[0].normalize()})
  }
  addFile(fileID:string, cellID:string)
  {
    return this.http.post(`https://localhost:7091/cells/${cellID}/add?fileID=${fileID}`,{})
  }

  getFile(fileID:string)
  {
    return this.http.get<File>(`https://localhost:7091/files/${fileID}`)
  }
  deleteFile(cellID:string,fileID:string)
  {
    return this.http.post(`https://localhost:7091/cells/${cellID}/del?fileID=${fileID}`,{})
  }
}
