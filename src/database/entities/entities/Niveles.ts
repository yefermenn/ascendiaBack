import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuarios } from "./Usuarios";

@Index("niveles_pkey", ["idNivel"], { unique: true })
@Entity("niveles", { schema: "public" })
export class Niveles {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_nivel" })
  idNivel: number;

  @Column("character varying", { name: "nombre_nivel", length: 50 })
  nombreNivel: string;

  @Column("integer", { name: "xp_requerido" })
  xpRequerido: number;

  @Column("text", { name: "descripcion", nullable: true })
  descripcion: string | null;

  @OneToMany(() => Usuarios, (usuarios) => usuarios.nivelActual)
  usuarios: Usuarios[];
}
