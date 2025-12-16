import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuarios } from "./Usuarios";
import { Ramas } from "./Ramas";

@Index("cursos_pkey", ["idCurso"], { unique: true })
@Entity("cursos", { schema: "public" })
export class Cursos {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_curso" })
  idCurso: number;

  @Column("character varying", { name: "external_id", nullable: true, length: 100 })
  externalId: string | null;

  @Column("character varying", { name: "titulo", length: 150 })
  titulo: string;

  @Column("character varying", { name: "institucion", nullable: true, length: 150 })
  institucion: string | null;

  @Column("integer", { name: "anio", nullable: true })
  anio: number | null;

  @Column("text", { name: "descripcion", nullable: true })
  descripcion: string | null;

  @Column("character varying", { name: "url", nullable: true, length: 255 })
  url: string | null;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.educacions, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUsuario" }])
  idUsuario: Usuarios;

  @ManyToOne(() => Ramas, (ramas) => ramas.cursos, { onDelete: "SET NULL" })
  @JoinColumn([{ name: "id_rama", referencedColumnName: "idRama" }])
  rama: Ramas;
}
