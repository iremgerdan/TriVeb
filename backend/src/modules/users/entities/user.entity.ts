import {
  AutoIncrement,
  Column,
  DataType,
  DefaultScope,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table
@DefaultScope(() => ({
  attributes: {
    exclude: ['password'],
  },
}))
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id: number;

  @Column({ type: DataType.TEXT, allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING(256), allowNull: false })
  fullname: string;
}
