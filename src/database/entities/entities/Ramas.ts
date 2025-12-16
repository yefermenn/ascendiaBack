import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cursos } from "./Cursos";

@Index("ramas_pkey", ["idRama"], { unique: true })
@Entity("ramas", { schema: "public" })
export class Ramas {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_rama" })
  idRama: number;

  @Column("character varying", { name: "nombre", length: 150 })
  nombre: string;

  @OneToMany(() => Cursos, (cursos) => cursos.rama)
  cursos: Cursos[];
}
