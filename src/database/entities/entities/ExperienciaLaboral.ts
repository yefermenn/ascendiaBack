import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuarios } from "./Usuarios";

@Index("experiencia_laboral_pkey", ["idExpLab"], { unique: true })
@Entity("experiencia_laboral", { schema: "public" })
export class ExperienciaLaboral {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_exp_lab" })
  idExpLab: number;

  @Column("character varying", { name: "empresa", nullable: true, length: 150 })
  empresa: string | null;

  @Column("character varying", { name: "cargo", nullable: true, length: 150 })
  cargo: string | null;

  @Column("text", { name: "descripcion", nullable: true })
  descripcion: string | null;

  @Column("date", { name: "fecha_inicio", nullable: true })
  fechaInicio: string | null;

  @Column("date", { name: "fecha_fin", nullable: true })
  fechaFin: string | null;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.experienciaLaborals, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUsuario" }])
  idUsuario: Usuarios;
}
