import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Logros } from "./Logros";
import { Usuarios } from "./Usuarios";

@Index("logros_usuario_pkey", ["idLogroUsuario"], { unique: true })
@Entity("logros_usuario", { schema: "public" })
export class LogrosUsuario {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_logro_usuario" })
  idLogroUsuario: number;

  @Column("timestamp without time zone", {
    name: "fecha_obtencion",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaObtencion: Date | null;

  @Column("boolean", {
    name: "visible_publico",
    nullable: true,
    default: () => "true",
  })
  visiblePublico: boolean | null;

  @ManyToOne(() => Logros, (logros) => logros.logrosUsuarios, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "id_logro", referencedColumnName: "idLogro" }])
  idLogro: Logros;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.logrosUsuarios, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUsuario" }])
  idUsuario: Usuarios;
}
