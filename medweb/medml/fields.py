import os
from typing import IO, TYPE_CHECKING
from PIL import Image
from django.db.models import FileField
from django.db.models.fields.files import FieldFile, FileDescriptor
import numpy
import tifffile
import pydicom
from django.db.models import signals


class DicomAndTiffFileDescriptor(FileDescriptor):

    if TYPE_CHECKING:
        field: "DicomAndTiffFileField"

    def __set__(self, instance, value):
        super().__set__(instance, value)


class DicomAndTiffFile(FieldFile):
    if TYPE_CHECKING:
        field: "DicomAndTiffFileField"

    @property
    def tiff_file(self):
        self._require_file()
        return os.path.join(self.name, self.field.tiff_name)

    @property
    def tiff_file_url(self):
        return self.storage.url(self.tiff_file)

    @property
    def png_files(self):
        self._require_file()
        fbase, filee = os.path.splitext(self.name)

        return os.path.join(fbase, self.field.slides_dir)

    @property
    def pngs_len(self):
        return len(os.listdir(self.storage.path(self.png_files)))

    @property
    def slide_template(self):
        return (
            self.storage.url(self.png_files),
            self.field.slide_name_prefix,
            self.field.slide_name_postfix,
        )

    def get_png_by_index(self, idx: int):
        return os.path.join(
            self.png_files, self.field.slide_name.format(idx + 1)
        )

    def get_png_by_index_url(self, idx: int):
        return self.storage.url(self.get_png_by_index(idx))

    def _prepare_file(self, name: str, content: IO):
        content.seek(0)
        fbase, filee = os.path.splitext(name)
        slides_dir = os.path.join(fbase, self.field.slides_dir)
        os.makedirs(slides_dir, 0o777, exist_ok=True)
        return fbase, filee.lower(), slides_dir

    def save_jpeg(self, name: str, content: IO):
        fbase, filee, slides_dir = self._prepare_file(name, content)
        try:
            tiff_desc, get_tiff = self._get_tiff(filee, content)
            for idx, slide in enumerate(get_tiff):
                slide_name = os.path.join(
                    slides_dir, self.field.slide_name.format(idx + 1)
                )
                with open(slide_name, "wb") as out:
                    with Image.fromarray(slide) as img:
                        img.save(out)
        except Exception as e:
            raise Exception(str(e)) from e
        return 1

    def _get_tiff(self, filee: str, content: IO):
        content.seek(0)
        match filee := filee.lower():
            case ".tif" | ".tiff":
                try:
                    t = tifffile.imread(content)
                    return t, t
                except tifffile.TiffFileError as e:
                    raise AttributeError(f"Битый .tif файл. {e}")
            case ".dcm":
                try:
                    t = pydicom.dcmread(content)
                    return t, t.pixel_array
                except Exception as e:
                    raise AttributeError(f"Битый .dcm файл.")
            case _:
                try:
                    t = Image.open(content)
                    return t, numpy.array([numpy.array(t)])
                except Exception as e:
                    raise AttributeError(f"Битый файл.")

    def save_tiff(self, name: str, content: IO):
        fbase, filee, slides_dir = self._prepare_file(name, content)
        try:
            tiff_descr, tiff_get = self._get_tiff(filee, content)

            with open(os.path.join(fbase, self.field.tiff_name), "wb") as out:
                tifffile.imwrite(
                    out,
                    tiff_get,
                    compression=tifffile.COMPRESSION.PNG,
                    compressionargs={"level": 9},
                )
            return len(tiff_get)
        except Exception as e:
            raise Exception(str(e)) from e

    def save(self, name: str, content: IO, save=True):
        name = self.field.generate_filename(self.instance, name)
        self.name = self.storage.save(
            name, content, max_length=self.field.max_length
        )
        setattr(self.instance, self.field.attname, self.name)
        full_path = self.storage.path(self.name)
        n_slides = self.save_tiff(full_path, content)
        self.save_jpeg(full_path, content)
        self._committed = True
        setattr(self.instance, "image_count", n_slides)
        if save:
            self.instance.save()

    save.alters_data = True


class DicomAndTiffFileField(FileField):
    attr_class = DicomAndTiffFile
    descriptor_class = DicomAndTiffFileDescriptor

    slides_dir = "pngs"
    tiff_name = "main.tiff"
    # slide_name = "slide_{}.png"
    slide_name_prefix = "slide_"
    slide_name_postfix = ".png"

    @property
    def slide_name(self):
        return "%s{}%s" % (self.slide_name_prefix, self.slide_name_postfix)
