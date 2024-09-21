import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity('employees')
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 45,
        nullable: false,
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 45,
        nullable: false,
        unique: true,
    })
    phoneNumber: string;

    @Column({
        type: 'varchar',
        length: 45,
        nullable: false,
        unique: true,
    })
    email: string;

    @Column({
        type: 'varchar',
        length: 45,
        nullable: false,
    })
    role: string;

    @Column({
        type: 'varchar',
        length: 60,
        nullable: true,
    })
    pass: string;
}
