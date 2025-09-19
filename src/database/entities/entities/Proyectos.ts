import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuarios } from "./Usuarios";

@Index("proyectos_pkey", ["idProyecto"], { unique: true })
@Index("idx_proyectos_usuario", ["idUsuario"], {})
@Entity("proyectos", { schema: "public" })
export class Proyectos {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_proyecto" })
  idProyecto: number;

  @Column("integer", { name: "id_usuario", nullable: true })
  idUsuario: number | null;

  @Column("character varying", { name: "titulo", length: 150 })
  titulo: string;

  @Column("text", { name: "descripcion", nullable: true })
  descripcion: string | null;

  @Column("character varying", {
    name: "tecnologias",
    nullable: true,
    length: 255,
  })
  tecnologias: string | null;

  @Column("character varying", { name: "url", nullable: true, length: 255 })
  url: string | null;

  @Column("character varying", {
    name: "imagen_destacada",
    nullable: true,
    length: 255,
  })
  imagenDestacada: string | null;

  @Column("timestamp without time zone", {
    name: "fecha_creacion",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaCreacion: Date | null;

  @Column("boolean", {
    name: "destacado",
    nullable: true,
    default: () => "false",
  })
  destacado: boolean | null;

  @Column("integer", {
    name: "xp_otorgado",
    nullable: true,
    default: () => "0",
  })
  xpOtorgado: number | null;

  // Permitimos almacenar múltiples URLs como JSON string
  @Column("text", { name: "urls", nullable: true })
  urls: string | null;

  @Column("character varying", { name: "external_id", nullable: true, length: 100 })
  externalId: string | null;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.proyectos, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUsuario" }])
  idUsuario2: Usuarios;
}
