import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuarios } from "./Usuarios";

@Index("educacion_pkey", ["idEducacion"], { unique: true })
@Entity("educacion", { schema: "public" })
export class Educacion {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_educacion" })
  idEducacion: number;

  @Column("character varying", {
    name: "institucion",
    nullable: true,
    length: 150,
  })
  institucion: string | null;

  @Column("character varying", {
    name: "titulo_obtenido",
    nullable: true,
    length: 150,
  })
  tituloObtenido: string | null;

  @Column("date", { name: "fecha_inicio", nullable: true })
  fechaInicio: string | null;

  @Column("date", { name: "fecha_fin", nullable: true })
  fechaFin: string | null;

  // Campos nuevos para alinearse con el payload del frontend
  @Column("character varying", {
    name: "external_id",
    nullable: true,
    length: 100,
  })
  externalId: string | null;

  @Column("character varying", {
    name: "nivel",
    nullable: true,
    length: 100,
  })
  nivel: string | null;

  @Column("character varying", {
    name: "anio",
    nullable: true,
    length: 10,
  })
  anio: string | null;

  @Column("text", { name: "descripcion", nullable: true })
  descripcion: string | null;

  @Column("character varying", { name: "url", nullable: true, length: 255 })
  url: string | null;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.educacions, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUsuario" }])
  idUsuario: Usuarios;
}
