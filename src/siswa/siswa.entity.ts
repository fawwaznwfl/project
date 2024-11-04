import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Siswa extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nama: string;

  @Column()
  tempat_lahir: string;

  @Column()
  tanggal_lahir: string;

  @Column()
  nisn: string;

  @Column()
  nik : string;

  @Column()
  alamat? : string;

  @Column()
  email? : string;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}