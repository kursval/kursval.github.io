require_relative 'course_parser'

abort("Takes 2 arguments: study year[XX_XX], language[en, sv]") unless ARGV.length == 2
study_year = ARGV[0]
language = ARGV[1]

program_list = [
    { id:'a',    name: 'Arkitektur'},
    { id:'b',    name: 'Bioteknik'},
    { id:'d',    name: 'Datateknik'},
    { id:'w',    name: 'Ekosystemteknik'},
    { id:'e',    name: 'Elektroteknik'},
    { id:'i',    name: 'Industriell ekonomi'},
    { id:'c',    name: 'Infocom'},
    { id:'k',    name: 'Kemiteknik'},
    { id:'l',    name: 'Lantmäteri'},
    { id:'m',    name: 'Maskinteknik'},
    { id:'md',   name: 'Maskinteknik - Teknisk design'},
    { id:'bme',  name: 'Medicin och teknik'},
    { id:'f',    name: 'Teknisk fysik'},
    { id:'pi',   name: 'Teknisk matematik'},
    { id:'n',    name: 'Teknisk nanovetenskap'},
    { id:'v',    name: 'Väg och vattenbyggnad'},
];


PATH = "../programs/"

program_list.each do |o|
    id = o[:id]
    name = o[:name]
	result = parse(id, study_year, language)
	filename = PATH + id.to_s + ".json"
	File.open(filename, 'w') { |file| file.write(result) }
end
