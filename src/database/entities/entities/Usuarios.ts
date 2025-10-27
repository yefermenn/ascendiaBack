import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Admin } from "./Admin";
import { Certificaciones } from "./Certificaciones";
import { Educacion } from "./Educacion";
import { ExperienciaLaboral } from "./ExperienciaLaboral";
import { LogrosUsuario } from "./LogrosUsuario";
import { Notificaciones } from "./Notificaciones";
import { Personajes } from "./Personajes";
import { Proyectos } from "./Proyectos";
import { Seguidores } from "./Seguidores";
import { Niveles } from "./Niveles";
import { UsuariosRedes } from "./UsuariosRedes";

@Index("usuarios_correo_key", ["correo"], { unique: true })
@Index("usuarios_pkey", ["idUsuario"], { unique: true })
@Index("idx_usuarios_nivel", ["nivelActual"], {})
@Entity("usuarios", { schema: "public" })
export class Usuarios {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_usuario" })
  idUsuario: number;

  @Column("character varying", { name: "nombre", length: 100 })
  nombre: string;

  @Column("character varying", { name: "correo", unique: true, length: 100 })
  correo: string;

  @Column("character varying", { name: "contraseña_hash", length: 255 })
  contraseAHash: string;

  @Column("text", { name: "biografia", nullable: true })
  biografia: string | null;

  @Column("integer", { name: "nivel_actual", nullable: true })
  nivelActual: number | null;

  @Column("integer", { name: "xp_total", nullable: true, default: () => "0" })
  xpTotal: number | null;

  @Column("timestamp without time zone", {
    name: "fecha_registro",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaRegistro: Date | null;

  @Column("character varying", {
    name: "foto_perfil",
    nullable: true,
    length: 255,
  })
  fotoPerfil: string | null;

  @Column("character varying", {
    name: "rol",
    nullable: true,
    length: 20,
    default: () => "'usuario'",
  })
  rol: string | null;

  @Column("boolean", { name: "estado", nullable: true, default: () => "true" })
  estado: boolean | null;

  @OneToOne(() => Admin, (admin) => admin.idUsuario2)
  admin: Admin;

  @OneToMany(
    () => Certificaciones,
    (certificaciones) => certificaciones.idUsuario2
  )
  certificaciones: Certificaciones[];

  @OneToMany(() => Educacion, (educacion) => educacion.idUsuario)
  educacions: Educacion[];

  @OneToMany(
    () => ExperienciaLaboral,
    (experienciaLaboral) => experienciaLaboral.idUsuario
  )
  experienciaLaborals: ExperienciaLaboral[];

  @OneToMany(() => LogrosUsuario, (logrosUsuario) => logrosUsuario.idUsuario)
  logrosUsuarios: LogrosUsuario[];

  @OneToMany(
    () => Notificaciones,
    (notificaciones) => notificaciones.idUsuario2
  )
  notificaciones: Notificaciones[];

  @OneToOne(() => Personajes, (personajes) => personajes.idUsuario2)
  personajes: Personajes;

  @OneToMany(() => Proyectos, (proyectos) => proyectos.idUsuario2)
  proyectos: Proyectos[];

  @OneToMany(() => Seguidores, (seguidores) => seguidores.idSeguido2)
  seguidores: Seguidores[];

  @OneToMany(() => Seguidores, (seguidores) => seguidores.idSeguidor2)
  seguidores2: Seguidores[];

  @ManyToOne(() => Niveles, (niveles) => niveles.usuarios, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "nivel_actual", referencedColumnName: "idNivel" }])
  nivelActual2: Niveles;

  @OneToMany(() => UsuariosRedes, (usuariosRedes) => usuariosRedes.idUsuario)
  usuariosRedes: UsuariosRedes[];
}
