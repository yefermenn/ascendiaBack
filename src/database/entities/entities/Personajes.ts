import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuarios } from "./Usuarios";

@Index("personajes_pkey", ["idPersonaje"], { unique: true })
@Index("personajes_id_usuario_key", ["idUsuario"], { unique: true })
@Entity("personajes", { schema: "public" })
export class Personajes {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_personaje" })
  idPersonaje: number;

  @Column("integer", { name: "id_usuario", nullable: true, unique: true })
  idUsuario: number | null;

  @Column("character varying", {
    name: "nombre_personaje",
    nullable: true,
    length: 100,
  })
  nombrePersonaje: string | null;

  @Column("jsonb", { name: "apariencia", nullable: true })
  apariencia: object | null;

  @Column("integer", {
    name: "nivel_personaje",
    nullable: true,
    default: () => "1",
  })
  nivelPersonaje: number | null;

  @Column("timestamp without time zone", {
    name: "fecha_creacion",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaCreacion: Date | null;

  @OneToOne(() => Usuarios, (usuarios) => usuarios.personajes, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUsuario" }])
  idUsuario2: Usuarios;
}
