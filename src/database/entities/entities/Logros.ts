import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { LogrosUsuario } from "./LogrosUsuario";

@Index("logros_pkey", ["idLogro"], { unique: true })
@Index("idx_logros_tipo", ["tipo"], {})
@Entity("logros", { schema: "public" })
export class Logros {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_logro" })
  idLogro: number;

  @Column("character varying", { name: "nombre", length: 100 })
  nombre: string;

  @Column("text", { name: "descripcion", nullable: true })
  descripcion: string | null;

  @Column("character varying", { name: "tipo", length: 30 })
  tipo: string;

  @Column("character varying", {
    name: "rareza",
    nullable: true,
    length: 20,
    default: () => "'comun'",
  })
  rareza: string | null;

  @Column("character varying", { name: "icono", nullable: true, length: 255 })
  icono: string | null;

  @Column("integer", { name: "xp_extra", nullable: true, default: () => "0" })
  xpExtra: number | null;

  @OneToMany(() => LogrosUsuario, (logrosUsuario) => logrosUsuario.idLogro)
  logrosUsuarios: LogrosUsuario[];
}
