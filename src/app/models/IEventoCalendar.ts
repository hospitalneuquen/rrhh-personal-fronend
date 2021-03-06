export interface IEventoCalendar {
    _id:String,
    title: String,
    start: Date,
    allDay: Boolean,
    color?: String,
    type: String,
    rendering?: String,
    ausentismoFechaDesde: Date,
    ausentismoFechaHasta: Date,
    startString?: String
}